const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const prisma = require('../prisma')

const router = express.Router()

// POST /api/bookings (Public/Guest allowed)
router.post('/', async (req, res, next) => {
  try {
    const body = z.object({
      rentalId: z.string(),
      userName: z.string().min(1),
      userPhone: z.string().min(1),
      visitDate: z.string().min(1),
      message: z.string().optional(),
      userId: z.string().optional() // Passed from frontend localStorage
    }).parse(req.body)

    const rental = await prisma.rental.findUnique({ where: { id: body.rentalId } })
    if (!rental) return res.status(404).json({ message: 'Rental not found' })

    const booking = await prisma.booking.create({
      data: {
        rentalId: body.rentalId,
        ownerId: rental.ownerId,
        userId: body.userId || req.user?.id || 'guest',
        userName: body.userName,
        userPhone: body.userPhone,
        visitDate: body.visitDate,
        message: body.message,
        status: 'Pending'
      }
    })

    // Immediately mark rental as Booked
    await prisma.rental.update({
      where: { id: body.rentalId },
      data: { status: 'Booked' }
    })

    // Auto-create conversation if userId is present
    const guestId = body.userId || req.user?.id || 'guest'
    let conv = await prisma.conversation.findFirst({
      where: { rentalId: body.rentalId, ownerId: rental.ownerId, userId: guestId }
    })
    
    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          rentalId: body.rentalId,
          ownerId: rental.ownerId,
          userId: guestId,
          userName: body.userName
        }
      })
    }

    // Create Notification for the Owner
    await prisma.notification.create({
      data: {
        userId: rental.ownerId,
        title: 'New Booking Request',
        message: `${body.userName} requested a visit for ${rental.title}`,
        type: 'Booking'
      }
    })

    res.status(201).json({ item: booking, conversation: conv })
  } catch (err) {
    next(err)
  }
})

// GET /api/bookings/owner (Private)
router.get('/owner', requireAuth, async (req, res, next) => {
  try {
    const ownerId = req.user.id
    const bookings = await prisma.booking.findMany({
      where: { ownerId },
      include: {
        rental: { select: { title: true, imageUrls: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ items: bookings })
  } catch (err) {
    next(err)
  }
})

// PUT /api/bookings/:id/status (Private)
router.put('/:id/status', requireAuth, async (req, res, next) => {
  try {
    const { status } = z.object({ status: z.string() }).parse(req.body)
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status }
    })
    
    // If rejected, mark the rental as Available again
    if (status === 'Rejected') {
      await prisma.rental.update({
        where: { id: booking.rentalId },
        data: { status: 'Available' }
      })
    }

    // Create Notification for the User
    if (booking.userId) {
      await prisma.notification.create({
        data: {
          userId: booking.userId,
          title: `Booking ${status}`,
          message: `Your booking request was ${status.toLowerCase()} by the owner.`,
          type: 'Booking'
        }
      })
    }

    res.json({ item: booking })
  } catch (err) {
    next(err)
  }
})

module.exports = router
