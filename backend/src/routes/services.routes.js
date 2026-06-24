const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const prisma = require('../prisma')

const router = express.Router()

// GET /api/services (Public: All services for users)
router.get('/', async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        owner: {
          select: { name: true, email: true }
        }
      }
    })
    services.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ items: services })
  } catch (err) {
    next(err)
  }
})

// GET /api/services/my (Private: Owner's services)
router.get('/my', requireAuth, async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      where: { ownerId: req.user.id }
    })
    services.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ items: services })
  } catch (err) {
    next(err)
  }
})

// POST /api/services (Private: Create Service)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    console.log('[DEBUG] POST /api/services incoming req.body:', req.body)
    console.log('[DEBUG] POST /api/services req.user:', req.user)
    
    const body = z.object({
      title: z.string().min(3),
      address: z.string().min(5),
      pincode: z.number().int().positive(),
      nearbyAreas: z.array(z.string()).nonempty(),
      price: z.number().positive(),
      phoneNumber: z.string().min(10),
      description: z.string().min(5),
      imageUrls: z.array(z.string()).optional(),
      latitude: z.number(),
      longitude: z.number(),
      status: z.string().optional()
    }).parse(req.body)

    const payload = {
      ...body,
      imageUrls: body.imageUrls || [],
      status: body.status || 'Available',
      ownerId: req.user.id
    }

    const service = await prisma.service.create({
      data: payload
    })

    res.status(201).json({ item: service })
  } catch (err) {
    next(err)
  }
})

// PUT /api/services/:id (Private: Update Service)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const service = await prisma.service.findUnique({ where: { id: req.params.id } })
    if (!service) return res.status(404).json({ message: 'Not found' })
    if (service.ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    const body = z.object({
      title: z.string().min(3).optional(),
      address: z.string().min(5).optional(),
      pincode: z.number().int().positive().optional(),
      nearbyAreas: z.array(z.string()).optional(),
      price: z.number().positive().optional(),
      phoneNumber: z.string().min(10).optional(),
      description: z.string().min(5).optional(),
      imageUrls: z.array(z.string()).optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      status: z.string().optional()
    }).parse(req.body)

    const updated = await prisma.service.update({
      where: { id: req.params.id },
      data: body
    })

    res.json({ item: updated })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/services/:id (Private: Delete Service)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const service = await prisma.service.findUnique({ where: { id: req.params.id } })
    if (!service) return res.status(404).json({ message: 'Not found' })
    if (service.ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    await prisma.service.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
