const express = require('express')
const { z } = require('zod')
const { requireAuth, requireRole } = require('../middleware/auth')
const { Offer } = require('../models/Offer')
const { notifyAllUsers } = require('../services/notify')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').toString().trim()
    const filter = { isActive: true }
    if (q) filter.$text = { $search: q }
    const items = await Offer.find(filter).sort({ createdAt: -1 })
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const body = z
      .object({
        shopName: z.string().min(2),
        title: z.string().min(2),
        description: z.string().optional(),
        validUntil: z.string().datetime().optional(),
        imageUrl: z.string().url().optional(),
      })
      .parse(req.body)

    const item = await Offer.create({
      ...body,
      validUntil: body.validUntil ? new Date(body.validUntil) : undefined,
      createdBy: req.user._id,
    })

    await notifyAllUsers({
      type: 'offer',
      title: `New offer: ${item.shopName}`,
      message: item.title,
      data: { offerId: item._id.toString() },
    })

    res.status(201).json({ item })
  } catch (err) {
    next(err)
  }
})

module.exports = router

