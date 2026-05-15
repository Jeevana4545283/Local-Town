const express = require('express')
const { z } = require('zod')
const { requireAuth, requireRole } = require('../middleware/auth')
const { WorkerProfile } = require('../models/WorkerProfile')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const category = (req.query.category || '').toString()
    const filter = {}
    if (category) filter.category = category
    const items = await WorkerProfile.find(filter).sort({ createdAt: -1 }).populate('user', 'name phone')
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const body = z
      .object({
        category: z.enum(['electrician', 'plumber', 'painter', 'carpenter', 'labour']),
        headline: z.string().optional(),
        serviceArea: z.string().optional(),
        priceNote: z.string().optional(),
        experienceYears: z.number().min(0).optional(),
      })
      .parse(req.body)

    const existing = await WorkerProfile.findOne({ user: req.user._id })
    if (existing) return res.status(409).json({ message: 'Worker profile already exists' })

    const item = await WorkerProfile.create({ user: req.user._id, ...body })
    res.status(201).json({ item })
  } catch (err) {
    next(err)
  }
})

router.patch('/:id/verify', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const item = await WorkerProfile.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true })
    if (!item) return res.status(404).json({ message: 'Not found' })
    res.json({ item })
  } catch (err) {
    next(err)
  }
})

module.exports = router

