const express = require('express')
const { z } = require('zod')
const { requireAuth, requireRole } = require('../middleware/auth')
const { Alert } = require('../models/Alert')
const { notifyAllUsers } = require('../services/notify')

const router = express.Router()

router.get('/', async (_req, res, next) => {
  try {
    const items = await Alert.find({ isActive: true }).sort({ createdAt: -1 }).limit(50)
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const body = z
      .object({
        type: z.enum(['power-cut', 'news']),
        title: z.string().min(2),
        message: z.string().min(2),
        area: z.string().optional(),
        startsAt: z.string().datetime().optional(),
        endsAt: z.string().datetime().optional(),
      })
      .parse(req.body)

    const item = await Alert.create({
      ...body,
      startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
      endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
      createdBy: req.user._id,
    })

    await notifyAllUsers({
      type: 'alert',
      title: item.title,
      message: item.message,
      data: { alertId: item._id.toString(), alertType: item.type },
    })

    res.status(201).json({ item })
  } catch (err) {
    next(err)
  }
})

module.exports = router

