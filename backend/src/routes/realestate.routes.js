const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const { RealEstateListing } = require('../models/RealEstateListing')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').toString().trim()
    const filter = { isActive: true }
    if (q) filter.$text = { $search: q }
    const items = await RealEstateListing.find(filter).sort({ createdAt: -1 }).populate('owner', 'name phone')
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const body = z
      .object({
        title: z.string().min(3),
        description: z.string().optional(),
        kind: z.enum(['plot', 'house', 'commercial']),
        areaSqFt: z.number().min(0).optional(),
        price: z.number().min(0),
        address: z.string().optional(),
        images: z.array(z.string()).optional(),
      })
      .parse(req.body)

    const item = await RealEstateListing.create({ owner: req.user._id, ...body, images: body.images || [] })
    res.status(201).json({ item })
  } catch (err) {
    next(err)
  }
})

module.exports = router

