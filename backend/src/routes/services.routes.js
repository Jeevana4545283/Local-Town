const express = require('express')
const { z } = require('zod')
const { requireAuth, requireRole } = require('../middleware/auth')
const { ServiceRequest } = require('../models/ServiceRequest')
const { notifyUser } = require('../services/notify')

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin'
    const filter = isAdmin ? {} : { requester: req.user._id }
    const items = await ServiceRequest.find(filter).sort({ createdAt: -1 })
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const body = z
      .object({
        type: z.enum(['home-cleaning', 'waste-management']),
        address: z.string().min(5),
        preferredDate: z.string().datetime().optional(),
        notes: z.string().optional(),
      })
      .parse(req.body)

    const item = await ServiceRequest.create({
      requester: req.user._id,
      ...body,
      preferredDate: body.preferredDate ? new Date(body.preferredDate) : undefined,
    })

    await notifyUser(req.user._id.toString(), {
      type: 'service',
      title: 'Request submitted',
      message: `Your ${item.type} request is open.`,
      data: { requestId: item._id.toString() },
    })

    res.status(201).json({ item })
  } catch (err) {
    next(err)
  }
})

router.patch('/:id/status', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const body = z
      .object({ status: z.enum(['open', 'assigned', 'completed', 'cancelled']) })
      .parse(req.body)

    const item = await ServiceRequest.findByIdAndUpdate(req.params.id, { status: body.status }, { new: true })
    if (!item) return res.status(404).json({ message: 'Not found' })

    await notifyUser(item.requester.toString(), {
      type: 'service',
      title: 'Service request updated',
      message: `Status changed to: ${body.status}`,
      data: { requestId: item._id.toString() },
    })

    res.json({ item })
  } catch (err) {
    next(err)
  }
})

module.exports = router

