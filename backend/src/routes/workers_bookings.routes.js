const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const prisma = require('../prisma')

const router = express.Router()

// POST /api/workers-workerBookings (Public/Guest allowed)
router.post('/', async (req, res, next) => {
  try {
    const body = z.object({
      workerId: z.string(),
      userName: z.string().min(1),
      userPhone: z.string().min(1),
      visitDate: z.string().min(1),
      message: z.string().optional(),
      userId: z.string().optional() // Passed from frontend localStorage
    }).parse(req.body)

    const worker = await prisma.worker.findUnique({ where: { id: body.workerId } })
    if (!worker) return res.status(404).json({ message: 'Worker not found' })

    const workerBooking = await prisma.workerBooking.create({
      data: {
        workerId: body.workerId,
        ownerId: worker.ownerId,
        userId: body.userId || req.user?.id || 'guest',
        userName: body.userName,
        userPhone: body.userPhone,
        visitDate: body.visitDate,
        message: body.message,
        status: 'Pending'
      }
    })

    // Immediately mark worker as Booked
    await prisma.worker.update({
      where: { id: body.workerId },
      data: { status: 'Booked' }
    })

    // Auto-create conversation if userId is present
    const guestId = body.userId || req.user?.id || 'guest'
    let conv = await prisma.conversation.findFirst({
      where: { workerId: body.workerId, ownerId: worker.ownerId, userId: guestId }
    })
    
    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          workerId: body.workerId,
          ownerId: worker.ownerId,
          userId: guestId,
          userName: body.userName
        }
      })
    }

    // Create Notification for the Owner
    await prisma.notification.create({
      data: {
        userId: worker.ownerId,
        title: 'New WorkerBooking Request',
        message: `${body.userName} requested a visit for ${worker.title}`,
        type: 'WorkerBooking'
      }
    })

    res.status(201).json({ item: workerBooking, conversation: conv })
  } catch (err) {
    next(err)
  }
})

// GET /api/workers-workerBookings/owner (Private)
router.get('/owner', requireAuth, async (req, res, next) => {
  try {
    const ownerId = req.user.id
    const items = await prisma.workerBooking.findMany({
      where: { ownerId },
      include: {
        worker: { select: { title: true, imageUrls: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

// PUT /api/workers-workerBookings/:id/status (Private)
router.put('/:id/status', requireAuth, async (req, res, next) => {
  try {
    const { status } = z.object({ status: z.string() }).parse(req.body)
    const workerBooking = await prisma.workerBooking.update({
      where: { id: req.params.id },
      data: { status }
    })
    
    // If rejected, mark the worker as Available again
    if (status === 'Rejected') {
      await prisma.worker.update({
        where: { id: workerBooking.workerId },
        data: { status: 'Available' }
      })
    }

    // Create Notification for the User
    if (workerBooking.userId) {
      await prisma.notification.create({
        data: {
          userId: workerBooking.userId,
          title: `WorkerBooking ${status}`,
          message: `Your workerBooking request was ${status.toLowerCase()} by the owner.`,
          type: 'WorkerBooking'
        }
      })
    }

    res.json({ item: workerBooking })
  } catch (err) {
    next(err)
  }
})

module.exports = router
