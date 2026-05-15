const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const { Favorite } = require('../models/Favorite')

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const items = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const body = z
      .object({
        targetType: z.enum(['rental', 'worker', 'offer', 'event', 'real-estate', 'materials']),
        targetId: z.string().min(1),
      })
      .parse(req.body)

    const item = await Favorite.create({ user: req.user._id, ...body })
    res.status(201).json({ item })
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ message: 'Already saved' })
    next(err)
  }
})

router.delete('/', requireAuth, async (req, res, next) => {
  try {
    const body = z
      .object({
        targetType: z.enum(['rental', 'worker', 'offer', 'event', 'real-estate', 'materials']),
        targetId: z.string().min(1),
      })
      .parse(req.body)

    await Favorite.deleteOne({ user: req.user._id, targetType: body.targetType, targetId: body.targetId })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router

