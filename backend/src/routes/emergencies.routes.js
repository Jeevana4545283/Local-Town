const express = require('express')
const { z } = require('zod')
const { requireAuth, requireRole } = require('../middleware/auth')
const { EmergencyRequest } = require('../models/EmergencyRequest')
const { notifyAllUsers, notifyUser } = require('../services/notify')

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin'
    const filter = isAdmin ? {} : { requester: req.user._id }
    const items = await EmergencyRequest.find(filter).sort({ createdAt: -1 })
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const body = z
      .object({
        type: z.enum(['ambulance', 'police', 'women-safety', 'fire']),
        address: z.string().min(5),
        details: z.string().optional(),
        priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
      })
      .parse(req.body)

    const item = await EmergencyRequest.create({
      requester: req.user._id,
      ...body,
      priority: body.priority || 'high',
    })

    await notifyAllUsers({
      type: 'emergency',
      title: `Emergency: ${item.type}`,
      message: item.address,
      data: { emergencyId: item._id.toString(), priority: item.priority },
    })

    res.status(201).json({ item })
  } catch (err) {
    next(err)
  }
})

router.patch('/:id/status', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const body = z
      .object({ status: z.enum(['open', 'dispatched', 'resolved', 'cancelled']) })
      .parse(req.body)
    const item = await EmergencyRequest.findByIdAndUpdate(req.params.id, { status: body.status }, { new: true })
    if (!item) return res.status(404).json({ message: 'Not found' })

    if (item.requester) {
      await notifyUser(item.requester.toString(), {
        type: 'emergency',
        title: 'Emergency request updated',
        message: `Status changed to: ${body.status}`,
        data: { emergencyId: item._id.toString() },
      })
    }

    res.json({ item })
  } catch (err) {
    next(err)
  }
})

module.exports = router

