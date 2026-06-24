const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const prisma = require('../prisma')

const router = express.Router()

// POST /api/conversations (Create conversation - usually called internally or by user)
router.post('/', async (req, res, next) => {
  try {
    const { rentalId, ownerId, userId, userName } = z.object({
      rentalId: z.string(),
      ownerId: z.string(),
      userId: z.string(),
      userName: z.string()
    }).parse(req.body)

    // Check if conversation already exists
    let conv = await prisma.conversation.findFirst({
      where: { rentalId, ownerId, userId }
    })

    if (!conv) {
      conv = await prisma.conversation.create({
        data: { rentalId, ownerId, userId, userName }
      })
    }

    res.status(201).json({ item: conv })
  } catch (err) {
    next(err)
  }
})

// GET /api/conversations/owner (Private: Owner's Inbox)
router.get('/owner', requireAuth, async (req, res, next) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { ownerId: req.user.id },
      include: {
        rental: { select: { title: true, imageUrls: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    })
    
    // Calculate unread
    const formatted = await Promise.all(conversations.map(async (c) => {
      const unreadCount = await prisma.message.count({
        where: { conversationId: c.id, senderId: c.userId, isRead: false }
      })
      return { ...c, unreadCount }
    }))

    res.json({ items: formatted })
  } catch (err) {
    next(err)
  }
})

// GET /api/conversations/user/:userId (Public: User's Inbox)
router.get('/user/:userId', async (req, res, next) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.params.userId },
      include: {
        rental: { select: { title: true, imageUrls: true } },
        owner: { select: { name: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    const formatted = await Promise.all(conversations.map(async (c) => {
      const unreadCount = await prisma.message.count({
        where: { conversationId: c.id, senderId: c.ownerId, isRead: false }
      })
      return { ...c, unreadCount }
    }))

    res.json({ items: formatted })
  } catch (err) {
    next(err)
  }
})

// GET /api/messages/:conversationId (Get chat history)
router.get('/:conversationId', async (req, res, next) => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.conversationId },
      orderBy: { createdAt: 'asc' }
    })

    res.json({ items: messages })
  } catch (err) {
    next(err)
  }
})

// POST /api/messages (Send message)
router.post('/messages', async (req, res, next) => {
  try {
    const { conversationId, senderId, message } = z.object({
      conversationId: z.string(),
      senderId: z.string(),
      message: z.string().min(1)
    }).parse(req.body)

    const msg = await prisma.message.create({
      data: { conversationId, senderId, message }
    })

    const conv = await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    })

    // Determine receiver
    const receiverId = senderId === conv.ownerId ? conv.userId : conv.ownerId

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: 'New Message',
        message: 'You have received a new message.',
        type: 'Message'
      }
    })

    res.status(201).json({ item: msg })
  } catch (err) {
    next(err)
  }
})

// PUT /api/messages/read/:conversationId (Mark messages as read)
router.put('/messages/read/:conversationId', async (req, res, next) => {
  try {
    const { readerId } = req.body // the person reading it (ownerId or userId)

    // Mark messages as read where sender is NOT the reader
    await prisma.message.updateMany({
      where: {
        conversationId: req.params.conversationId,
        senderId: { not: readerId },
        isRead: false
      },
      data: { isRead: true }
    })

    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
