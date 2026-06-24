const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const prisma = require('../prisma')

const router = express.Router()

// POST /api/marketplace-marketplaceOrders (Public/Guest allowed)
router.post('/', async (req, res, next) => {
  try {
    const body = z.object({
      marketplaceItemId: z.string(),
      userName: z.string().min(1),
      userPhone: z.string().min(1),
      visitDate: z.string().min(1),
      message: z.string().optional(),
      userId: z.string().optional() // Passed from frontend localStorage
    }).parse(req.body)

    const marketplaceItem = await prisma.marketplaceItem.findUnique({ where: { id: body.marketplaceItemId } })
    if (!marketplaceItem) return res.status(404).json({ message: 'MarketplaceItem not found' })

    const marketplaceOrder = await prisma.marketplaceOrder.create({
      data: {
        marketplaceItemId: body.marketplaceItemId,
        ownerId: marketplaceItem.ownerId,
        userId: body.userId || req.user?.id || 'guest',
        userName: body.userName,
        userPhone: body.userPhone,
        visitDate: body.visitDate,
        message: body.message,
        status: 'Pending'
      }
    })

    // Immediately mark marketplaceItem as Booked
    await prisma.marketplaceItem.update({
      where: { id: body.marketplaceItemId },
      data: { status: 'Booked' }
    })

    // Auto-create conversation if userId is present
    const guestId = body.userId || req.user?.id || 'guest'
    let conv = await prisma.conversation.findFirst({
      where: { marketplaceItemId: body.marketplaceItemId, ownerId: marketplaceItem.ownerId, userId: guestId }
    })
    
    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          marketplaceItemId: body.marketplaceItemId,
          ownerId: marketplaceItem.ownerId,
          userId: guestId,
          userName: body.userName
        }
      })
    }

    // Create Notification for the Owner
    await prisma.notification.create({
      data: {
        userId: marketplaceItem.ownerId,
        title: 'New MarketplaceOrder Request',
        message: `${body.userName} requested a visit for ${marketplaceItem.title}`,
        type: 'MarketplaceOrder'
      }
    })

    res.status(201).json({ item: marketplaceOrder, conversation: conv })
  } catch (err) {
    next(err)
  }
})

// GET /api/marketplace-marketplaceOrders/owner (Private)
router.get('/owner', requireAuth, async (req, res, next) => {
  try {
    const ownerId = req.user.id
    const items = await prisma.marketplaceOrder.findMany({
      where: { ownerId },
      include: {
        marketplaceItem: { select: { title: true, imageUrls: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

// PUT /api/marketplace-marketplaceOrders/:id/status (Private)
router.put('/:id/status', requireAuth, async (req, res, next) => {
  try {
    const { status } = z.object({ status: z.string() }).parse(req.body)
    const marketplaceOrder = await prisma.marketplaceOrder.update({
      where: { id: req.params.id },
      data: { status }
    })
    
    // If rejected, mark the marketplaceItem as Available again
    if (status === 'Rejected') {
      await prisma.marketplaceItem.update({
        where: { id: marketplaceOrder.marketplaceItemId },
        data: { status: 'Available' }
      })
    }

    // Create Notification for the User
    if (marketplaceOrder.userId) {
      await prisma.notification.create({
        data: {
          userId: marketplaceOrder.userId,
          title: `MarketplaceOrder ${status}`,
          message: `Your marketplaceOrder request was ${status.toLowerCase()} by the owner.`,
          type: 'MarketplaceOrder'
        }
      })
    }

    res.json({ item: marketplaceOrder })
  } catch (err) {
    next(err)
  }
})

module.exports = router
