const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const prisma = require('../prisma')

const router = express.Router()

// GET /api/marketplace (Public: All marketplace for users)
router.get('/', async (req, res, next) => {
  try {
    const marketplace = await prisma.marketplaceItem.findMany({
      include: {
        owner: {
          select: { name: true, email: true }
        }
      }
    })
    marketplace.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ items: marketplace })
  } catch (err) {
    next(err)
  }
})

// GET /api/marketplace/my (Private: Owner's marketplace)
router.get('/my', requireAuth, async (req, res, next) => {
  try {
    const marketplace = await prisma.marketplaceItem.findMany({
      where: { ownerId: req.user.id }
    })
    marketplace.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ items: marketplace })
  } catch (err) {
    next(err)
  }
})

// POST /api/marketplace (Private: Create MarketplaceItem)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const body = z.object({
      title: z.string().min(3),
      address: z.string().min(5),
      pincode: z.number().int().positive(),
      nearbyAreas: z.array(z.string()).nonempty(),
      itemPrice: z.number().positive(),
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

    const marketplaceItem = await prisma.marketplaceItem.create({
      data: payload
    })

    res.status(201).json({ item: marketplaceItem })
  } catch (err) {
    next(err)
  }
})

// PUT /api/marketplace/:id (Private: Update MarketplaceItem)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const marketplaceItem = await prisma.marketplaceItem.findUnique({ where: { id: req.params.id } })
    if (!marketplaceItem) return res.status(404).json({ message: 'Not found' })
    if (marketplaceItem.ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    const body = z.object({
      title: z.string().min(3).optional(),
      address: z.string().min(5).optional(),
      pincode: z.number().int().positive().optional(),
      nearbyAreas: z.array(z.string()).optional(),
      itemPrice: z.number().positive().optional(),
      phoneNumber: z.string().min(10).optional(),
      description: z.string().min(5).optional(),
      imageUrls: z.array(z.string()).optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      status: z.string().optional()
    }).parse(req.body)

    const updated = await prisma.marketplaceItem.update({
      where: { id: req.params.id },
      data: body
    })

    res.json({ item: updated })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/marketplace/:id (Private: Delete MarketplaceItem)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const marketplaceItem = await prisma.marketplaceItem.findUnique({ where: { id: req.params.id } })
    if (!marketplaceItem) return res.status(404).json({ message: 'Not found' })
    if (marketplaceItem.ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    await prisma.marketplaceItem.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
