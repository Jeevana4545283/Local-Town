const express = require('express')
const { z } = require('zod')
const { requireAuth, requireRole } = require('../middleware/auth')
const { MaterialOrder } = require('../models/MaterialOrder')

const router = express.Router()

router.get('/orders', requireAuth, async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin'
    const filter = isAdmin ? {} : { buyer: req.user._id }
    const items = await MaterialOrder.find(filter).sort({ createdAt: -1 })
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

router.post('/orders', requireAuth, async (req, res, next) => {
  try {
    const body = z
      .object({
        items: z
          .array(
            z.object({
              material: z.enum(['cement', 'sand', 'bricks', 'steel']),
              quantity: z.number().min(1),
              unit: z.string().optional(),
            }),
          )
          .min(1),
        deliveryAddress: z.string().min(5),
        notes: z.string().optional(),
        amount: z.number().min(0).optional(),
      })
      .parse(req.body)

    const item = await MaterialOrder.create({
      buyer: req.user._id,
      items: body.items,
      deliveryAddress: body.deliveryAddress,
      notes: body.notes,
      amount: body.amount || 0,
    })
    res.status(201).json({ item })
  } catch (err) {
    next(err)
  }
})

router.patch('/orders/:id/status', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const body = z
      .object({
        status: z.enum(['placed', 'confirmed', 'out-for-delivery', 'delivered', 'cancelled']),
        paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
      })
      .parse(req.body)

    const item = await MaterialOrder.findByIdAndUpdate(req.params.id, body, { new: true })
    if (!item) return res.status(404).json({ message: 'Not found' })
    res.json({ item })
  } catch (err) {
    next(err)
  }
})

module.exports = router

