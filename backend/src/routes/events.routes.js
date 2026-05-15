const express = require('express')
const { z } = require('zod')
const { requireAuth, requireRole } = require('../middleware/auth')
const { Event } = require('../models/Event')
const { notifyAllUsers } = require('../services/notify')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const items = await Event.find({ isActive: true }).sort({ startsAt: 1 })
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const body = z
      .object({
        title: z.string().min(3),
        description: z.string().optional(),
        startsAt: z.string().datetime(),
        endsAt: z.string().datetime().optional(),
        venue: z.string().optional(),
        organizerName: z.string().optional(),
        contactPhone: z.string().optional(),
      })
      .parse(req.body)

    const item = await Event.create({
      ...body,
      startsAt: new Date(body.startsAt),
      endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
      createdBy: req.user._id,
    })

    await notifyAllUsers({
      type: 'event',
      title: `New event: ${item.title}`,
      message: item.venue || '',
      data: { eventId: item._id.toString() },
    })

    res.status(201).json({ item })
  } catch (err) {
    next(err)
  }
})

module.exports = router

