const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const prisma = require('../prisma')

const router = express.Router()

// GET /api/events (Public: All events for users)
router.get('/', async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        owner: {
          select: { name: true, email: true }
        }
      }
    })
    events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ items: events })
  } catch (err) {
    next(err)
  }
})

// GET /api/events/my (Private: Owner's events)
router.get('/my', requireAuth, async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      where: { ownerId: req.user.id }
    })
    events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ items: events })
  } catch (err) {
    next(err)
  }
})

// POST /api/events (Private: Create Event)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const body = z.object({
      title: z.string().min(3),
      address: z.string().min(5),
      pincode: z.number().int().positive(),
      nearbyAreas: z.array(z.string()).nonempty(),
      ticketPrice: z.number().positive(),
      phoneNumber: z.string().min(10),
      description: z.string().min(5),
      imageUrls: z.array(z.string()).nonempty(),
      latitude: z.number(),
      longitude: z.number(),
      status: z.string().optional()
    }).parse(req.body)

    const payload = {
      ...body,
      status: body.status || 'Available',
      ownerId: req.user.id
    }

    const event = await prisma.event.create({
      data: payload
    })

    res.status(201).json({ item: event })
  } catch (err) {
    next(err)
  }
})

// PUT /api/events/:id (Private: Update Event)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } })
    if (!event) return res.status(404).json({ message: 'Not found' })
    if (event.ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    const body = z.object({
      title: z.string().min(3).optional(),
      address: z.string().min(5).optional(),
      pincode: z.number().int().positive().optional(),
      nearbyAreas: z.array(z.string()).optional(),
      ticketPrice: z.number().positive().optional(),
      phoneNumber: z.string().min(10).optional(),
      description: z.string().min(5).optional(),
      imageUrls: z.array(z.string()).optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      status: z.string().optional()
    }).parse(req.body)

    const updated = await prisma.event.update({
      where: { id: req.params.id },
      data: body
    })

    res.json({ item: updated })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/events/:id (Private: Delete Event)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } })
    if (!event) return res.status(404).json({ message: 'Not found' })
    if (event.ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    await prisma.event.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
