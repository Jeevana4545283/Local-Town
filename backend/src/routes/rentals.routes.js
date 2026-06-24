const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const prisma = require('../prisma')

const router = express.Router()

// GET /api/rentals (Public: All rentals for users)
router.get('/', async (req, res, next) => {
  try {
    const rentals = await prisma.rental.findMany({
      include: {
        owner: {
          select: { name: true, email: true }
        }
      }
    })
    rentals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ items: rentals })
  } catch (err) {
    next(err)
  }
})

// GET /api/rentals/my (Private: Owner's rentals)
router.get('/my', requireAuth, async (req, res, next) => {
  try {
    const rentals = await prisma.rental.findMany({
      where: { ownerId: req.user.id }
    })
    rentals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ items: rentals })
  } catch (err) {
    next(err)
  }
})

// POST /api/rentals (Private: Create Rental)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const body = z.object({
      title: z.string().min(3),
      address: z.string().min(5),
      pincode: z.number().int().positive(),
      nearbyAreas: z.array(z.string()).nonempty(),
      rentPrice: z.number().positive(),
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

    const rental = await prisma.rental.create({
      data: payload
    })

    res.status(201).json({ item: rental })
  } catch (err) {
    next(err)
  }
})

// PUT /api/rentals/:id (Private: Update Rental)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const rental = await prisma.rental.findUnique({ where: { id: req.params.id } })
    if (!rental) return res.status(404).json({ message: 'Not found' })
    if (rental.ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    const body = z.object({
      title: z.string().min(3).optional(),
      address: z.string().min(5).optional(),
      pincode: z.number().int().positive().optional(),
      nearbyAreas: z.array(z.string()).optional(),
      rentPrice: z.number().positive().optional(),
      phoneNumber: z.string().min(10).optional(),
      description: z.string().min(5).optional(),
      imageUrls: z.array(z.string()).optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      status: z.string().optional()
    }).parse(req.body)

    const updated = await prisma.rental.update({
      where: { id: req.params.id },
      data: body
    })

    res.json({ item: updated })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/rentals/:id (Private: Delete Rental)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const rental = await prisma.rental.findUnique({ where: { id: req.params.id } })
    if (!rental) return res.status(404).json({ message: 'Not found' })
    if (rental.ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    await prisma.rental.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
