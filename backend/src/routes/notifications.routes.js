const express = require('express')
const prisma = require('../prisma')

const router = express.Router()

// GET /api/notifications/:userId (Public/Private based on ID, safe enough for now)
router.get('/:userId', async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.params.userId },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to latest 50
    })
    res.json({ items: notifications })
  } catch (err) {
    next(err)
  }
})

// PUT /api/notifications/:id/read (Mark a single notification as read)
router.put('/:id/read', async (req, res, next) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    })
    res.json({ item: notification })
  } catch (err) {
    next(err)
  }
})

// PUT /api/notifications/read-all/:userId (Mark all as read for a user)
router.put('/read-all/:userId', async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.params.userId, isRead: false },
      data: { isRead: true }
    })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
