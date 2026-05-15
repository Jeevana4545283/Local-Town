const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const { RentalListing } = require('../models/RentalListing')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1))
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 12)))
    const q = (req.query.q || '').toString().trim()

    const filter = { isActive: true }
    if (q) filter.$text = { $search: q }

    const [items, total] = await Promise.all([
      RentalListing.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('owner', 'name phone'),
      RentalListing.countDocuments(filter),
    ])

    res.json({ items, page, limit, total })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const item = await RentalListing.findById(req.params.id).populate('owner', 'name phone')
    if (!item) return res.status(404).json({ message: 'Not found' })
    res.json({ item })
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
        kind: z.enum(['house', 'room']),
        address: z.string().optional(),
        location: z
          .object({ lng: z.number(), lat: z.number() })
          .optional(),
        rentPerMonth: z.number().min(0),
        deposit: z.number().min(0).optional(),
        bedrooms: z.number().min(0).optional(),
        bathrooms: z.number().min(0).optional(),
        furnished: z.boolean().optional(),
        images: z.array(z.string()).optional(),
      })
      .parse(req.body)

    const item = await RentalListing.create({
      owner: req.user._id,
      title: body.title,
      description: body.description,
      kind: body.kind,
      address: body.address,
      location: body.location
        ? { type: 'Point', coordinates: [body.location.lng, body.location.lat] }
        : undefined,
      rentPerMonth: body.rentPerMonth,
      deposit: body.deposit || 0,
      bedrooms: body.bedrooms || 0,
      bathrooms: body.bathrooms || 0,
      furnished: body.furnished || false,
      images: body.images || [],
    })

    res.status(201).json({ item })
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const item = await RentalListing.findById(req.params.id)
    if (!item) return res.status(404).json({ message: 'Not found' })
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const body = z
      .object({
        title: z.string().min(3).optional(),
        description: z.string().optional(),
        address: z.string().optional(),
        isActive: z.boolean().optional(),
        images: z.array(z.string()).optional(),
      })
      .parse(req.body)

    Object.assign(item, body)
    await item.save()
    res.json({ item })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const item = await RentalListing.findById(req.params.id)
    if (!item) return res.status(404).json({ message: 'Not found' })
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    await item.deleteOne()
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router

