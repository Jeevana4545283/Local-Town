const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const prisma = require('../prisma')

const router = express.Router()

// POST /api/events-eventRegistrations (Public/Guest allowed)
router.post('/', async (req, res, next) => {
  try {
    const body = z.object({
      eventId: z.string(),
      userName: z.string().min(1),
      userPhone: z.string().min(1),
      visitDate: z.string().min(1),
      message: z.string().optional(),
      userId: z.string().optional() // Passed from frontend localStorage
    }).parse(req.body)

    const event = await prisma.event.findUnique({ where: { id: body.eventId } })
    if (!event) return res.status(404).json({ message: 'Event not found' })

    const eventRegistration = await prisma.eventRegistration.create({
      data: {
        eventId: body.eventId,
        ownerId: event.ownerId,
        userId: body.userId || req.user?.id || 'guest',
        userName: body.userName,
        userPhone: body.userPhone,
        visitDate: body.visitDate,
        message: body.message,
        status: 'Pending'
      }
    })

    // Immediately mark event as Booked
    await prisma.event.update({
      where: { id: body.eventId },
      data: { status: 'Booked' }
    })

    // Auto-create conversation if userId is present
    const guestId = body.userId || req.user?.id || 'guest'
    let conv = await prisma.conversation.findFirst({
      where: { eventId: body.eventId, ownerId: event.ownerId, userId: guestId }
    })
    
    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          eventId: body.eventId,
          ownerId: event.ownerId,
          userId: guestId,
          userName: body.userName
        }
      })
    }

    // Create Notification for the Owner
    await prisma.notification.create({
      data: {
        userId: event.ownerId,
        title: 'New EventRegistration Request',
        message: `${body.userName} requested a visit for ${event.title}`,
        type: 'EventRegistration'
      }
    })

    res.status(201).json({ item: eventRegistration, conversation: conv })
  } catch (err) {
    next(err)
  }
})

// GET /api/events-eventRegistrations/owner (Private)
router.get('/owner', requireAuth, async (req, res, next) => {
  try {
    const ownerId = req.user.id
    const items = await prisma.eventRegistration.findMany({
      where: { ownerId },
      include: {
        event: { select: { title: true, imageUrls: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

// PUT /api/events-eventRegistrations/:id/status (Private)
router.put('/:id/status', requireAuth, async (req, res, next) => {
  try {
    const { status } = z.object({ status: z.string() }).parse(req.body)
    const eventRegistration = await prisma.eventRegistration.update({
      where: { id: req.params.id },
      data: { status }
    })
    
    // If rejected, mark the event as Available again
    if (status === 'Rejected') {
      await prisma.event.update({
        where: { id: eventRegistration.eventId },
        data: { status: 'Available' }
      })
    }

    // Create Notification for the User
    if (eventRegistration.userId) {
      await prisma.notification.create({
        data: {
          userId: eventRegistration.userId,
          title: `EventRegistration ${status}`,
          message: `Your eventRegistration request was ${status.toLowerCase()} by the owner.`,
          type: 'EventRegistration'
        }
      })
    }

    res.json({ item: eventRegistration })
  } catch (err) {
    next(err)
  }
})

module.exports = router
