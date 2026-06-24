const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const prisma = require('../prisma')

const router = express.Router()

// POST /api/offers-offerOrders (Public/Guest allowed)
router.post('/', async (req, res, next) => {
  try {
    const body = z.object({
      offerId: z.string(),
      userName: z.string().min(1),
      userPhone: z.string().min(1),
      visitDate: z.string().min(1),
      message: z.string().optional(),
      userId: z.string().optional() // Passed from frontend localStorage
    }).parse(req.body)

    const offer = await prisma.offer.findUnique({ where: { id: body.offerId } })
    if (!offer) return res.status(404).json({ message: 'Offer not found' })

    const offerOrder = await prisma.offerOrder.create({
      data: {
        offerId: body.offerId,
        ownerId: offer.ownerId,
        userId: body.userId || req.user?.id || 'guest',
        userName: body.userName,
        userPhone: body.userPhone,
        visitDate: body.visitDate,
        message: body.message,
        status: 'Pending'
      }
    })

    // Immediately mark offer as Booked
    await prisma.offer.update({
      where: { id: body.offerId },
      data: { status: 'Booked' }
    })

    // Auto-create conversation if userId is present
    const guestId = body.userId || req.user?.id || 'guest'
    let conv = await prisma.conversation.findFirst({
      where: { offerId: body.offerId, ownerId: offer.ownerId, userId: guestId }
    })
    
    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          offerId: body.offerId,
          ownerId: offer.ownerId,
          userId: guestId,
          userName: body.userName
        }
      })
    }

    // Create Notification for the Owner
    await prisma.notification.create({
      data: {
        userId: offer.ownerId,
        title: 'New OfferOrder Request',
        message: `${body.userName} requested a visit for ${offer.title}`,
        type: 'OfferOrder'
      }
    })

    res.status(201).json({ item: offerOrder, conversation: conv })
  } catch (err) {
    next(err)
  }
})

// GET /api/offers-offerOrders/owner (Private)
router.get('/owner', requireAuth, async (req, res, next) => {
  try {
    const ownerId = req.user.id
    const items = await prisma.offerOrder.findMany({
      where: { ownerId },
      include: {
        offer: { select: { title: true, imageUrls: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

// PUT /api/offers-offerOrders/:id/status (Private)
router.put('/:id/status', requireAuth, async (req, res, next) => {
  try {
    const { status } = z.object({ status: z.string() }).parse(req.body)
    const offerOrder = await prisma.offerOrder.update({
      where: { id: req.params.id },
      data: { status }
    })
    
    // If rejected, mark the offer as Available again
    if (status === 'Rejected') {
      await prisma.offer.update({
        where: { id: offerOrder.offerId },
        data: { status: 'Available' }
      })
    }

    // Create Notification for the User
    if (offerOrder.userId) {
      await prisma.notification.create({
        data: {
          userId: offerOrder.userId,
          title: `OfferOrder ${status}`,
          message: `Your offerOrder request was ${status.toLowerCase()} by the owner.`,
          type: 'OfferOrder'
        }
      })
    }

    res.json({ item: offerOrder })
  } catch (err) {
    next(err)
  }
})

module.exports = router
