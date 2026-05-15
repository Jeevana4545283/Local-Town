const express = require('express')
const { requireAuth } = require('../middleware/auth')
const { Notification } = require('../models/Notification')

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const items = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100)
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

router.post('/:id/read', requireAuth, async (req, res, next) => {
  try {
    const item = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { readAt: new Date() },
      { new: true },
    )
    if (!item) return res.status(404).json({ message: 'Not found' })
    res.json({ item })
  } catch (err) {
    next(err)
  }
})

module.exports = router

