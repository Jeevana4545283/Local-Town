const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const { Review } = require('../models/Review')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const targetType = (req.query.targetType || '').toString()
    const targetId = (req.query.targetId || '').toString()
    if (!targetType || !targetId) return res.status(400).json({ message: 'targetType and targetId required' })

    const items = await Review.find({ targetType, targetId }).sort({ createdAt: -1 }).populate('author', 'name')
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
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      })
      .parse(req.body)

    const item = await Review.create({ author: req.user._id, ...body })
    res.status(201).json({ item })
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ message: 'You already reviewed this item' })
    next(err)
  }
})

module.exports = router

