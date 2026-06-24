const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const prisma = require('../prisma')

const router = express.Router()

// GET /api/workers (Public: All workers for users)
router.get('/', async (req, res, next) => {
  try {
    const workers = await prisma.worker.findMany({
      include: {
        owner: {
          select: { name: true, email: true }
        }
      }
    })
    workers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ items: workers })
  } catch (err) {
    next(err)
  }
})

// GET /api/workers/my (Private: Owner's workers)
router.get('/my', requireAuth, async (req, res, next) => {
  try {
    const workers = await prisma.worker.findMany({
      where: { ownerId: req.user.id }
    })
    workers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ items: workers })
  } catch (err) {
    next(err)
  }
})

// POST /api/workers (Private: Create Worker)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    console.log('[DEBUG] POST /api/workers incoming req.body:', req.body)
    const body = z.object({
      name: z.string().min(2),
      profession: z.string().min(2),
      address: z.string().min(5),
      pincode: z.number().int().positive(),
      nearbyAreas: z.array(z.string()).optional(),
      hourlyRate: z.number().positive(),
      phone: z.string().min(10),
      description: z.string().optional(),
      imageUrls: z.array(z.string()).optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      status: z.string().optional()
    }).parse(req.body)

    const payload = {
      ...body,
      status: body.status || 'Available',
      ownerId: req.user.id
    }

    const worker = await prisma.worker.create({
      data: payload
    })

    res.status(201).json({ item: worker })
  } catch (err) {
    next(err)
  }
})

// PUT /api/workers/:id (Private: Update Worker)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const worker = await prisma.worker.findUnique({ where: { id: req.params.id } })
    if (!worker) return res.status(404).json({ message: 'Not found' })
    if (worker.ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    const body = z.object({
      name: z.string().min(2).optional(),
      profession: z.string().min(2).optional(),
      address: z.string().min(5).optional(),
      pincode: z.number().int().positive().optional(),
      nearbyAreas: z.array(z.string()).optional(),
      hourlyRate: z.number().positive().optional(),
      phone: z.string().min(10).optional(),
      description: z.string().optional(),
      imageUrls: z.array(z.string()).optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      status: z.string().optional()
    }).parse(req.body)

    const updated = await prisma.worker.update({
      where: { id: req.params.id },
      data: body
    })

    res.json({ item: updated })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/workers/:id (Private: Delete Worker)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const worker = await prisma.worker.findUnique({ where: { id: req.params.id } })
    if (!worker) return res.status(404).json({ message: 'Not found' })
    if (worker.ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    await prisma.worker.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
