const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const prisma = require('../prisma')

const router = express.Router()

// POST /api/services-serviceBookings (Public/Guest allowed)
router.post('/', async (req, res, next) => {
  try {
    const body = z.object({
      serviceId: z.string(),
      userName: z.string().min(1),
      userPhone: z.string().min(1),
      visitDate: z.string().min(1),
      message: z.string().optional(),
      userId: z.string().optional() // Passed from frontend localStorage
    }).parse(req.body)

    const service = await prisma.service.findUnique({ where: { id: body.serviceId } })
    if (!service) return res.status(404).json({ message: 'Service not found' })

    const serviceBooking = await prisma.serviceBooking.create({
      data: {
        serviceId: body.serviceId,
        ownerId: service.ownerId,
        userId: body.userId || req.user?.id || 'guest',
        userName: body.userName,
        userPhone: body.userPhone,
        visitDate: body.visitDate,
        message: body.message,
        status: 'Pending'
      }
    })

    // Immediately mark service as Booked
    await prisma.service.update({
      where: { id: body.serviceId },
      data: { status: 'Booked' }
    })

    // Auto-create conversation if userId is present
    const guestId = body.userId || req.user?.id || 'guest'
    let conv = await prisma.conversation.findFirst({
      where: { serviceId: body.serviceId, ownerId: service.ownerId, userId: guestId }
    })
    
    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          serviceId: body.serviceId,
          ownerId: service.ownerId,
          userId: guestId,
          userName: body.userName
        }
      })
    }

    // Create Notification for the Owner
    await prisma.notification.create({
      data: {
        userId: service.ownerId,
        title: 'New ServiceBooking Request',
        message: `${body.userName} requested a visit for ${service.title}`,
        type: 'ServiceBooking'
      }
    })

    res.status(201).json({ item: serviceBooking, conversation: conv })
  } catch (err) {
    next(err)
  }
})

// GET /api/services-serviceBookings/owner (Private)
router.get('/owner', requireAuth, async (req, res, next) => {
  try {
    const ownerId = req.user.id
    const items = await prisma.serviceBooking.findMany({
      where: { ownerId },
      include: {
        service: { select: { title: true, imageUrls: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

// PUT /api/services-serviceBookings/:id/status (Private)
router.put('/:id/status', requireAuth, async (req, res, next) => {
  try {
    const { status } = z.object({ status: z.string() }).parse(req.body)
    const serviceBooking = await prisma.serviceBooking.update({
      where: { id: req.params.id },
      data: { status }
    })
    
    // If rejected, mark the service as Available again
    if (status === 'Rejected') {
      await prisma.service.update({
        where: { id: serviceBooking.serviceId },
        data: { status: 'Available' }
      })
    }

    // Create Notification for the User
    if (serviceBooking.userId) {
      await prisma.notification.create({
        data: {
          userId: serviceBooking.userId,
          title: `ServiceBooking ${status}`,
          message: `Your serviceBooking request was ${status.toLowerCase()} by the owner.`,
          type: 'ServiceBooking'
        }
      })
    }

    res.json({ item: serviceBooking })
  } catch (err) {
    next(err)
  }
})

module.exports = router
