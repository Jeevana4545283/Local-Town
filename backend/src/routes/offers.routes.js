const express = require('express')
const { z } = require('zod')
const { requireAuth } = require('../middleware/auth')
const prisma = require('../prisma')

const router = express.Router()

// GET /api/offers (Public: All offers for users)
router.get('/', async (req, res, next) => {
  try {
    const offers = await prisma.offer.findMany({
      include: {
        owner: {
          select: { name: true, email: true }
        }
      }
    })
    offers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ items: offers })
  } catch (err) {
    next(err)
  }
})

// GET /api/offers/my (Private: Owner's offers)
router.get('/my', requireAuth, async (req, res, next) => {
  try {
    const offers = await prisma.offer.findMany({
      where: { ownerId: req.user.id }
    })
    offers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ items: offers })
  } catch (err) {
    next(err)
  }
})

// POST /api/offers (Private: Create Offer)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const body = z.object({
      title: z.string().min(3),
      address: z.string().min(5),
      pincode: z.number().int().positive(),
      nearbyAreas: z.array(z.string()).nonempty(),
      discountPrice: z.number().positive(),
      phoneNumber: z.string().length(10),
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

    const offer = await prisma.offer.create({
      data: payload
    })

    res.status(201).json({ item: offer })
  } catch (err) {
    next(err)
  }
})

// PUT /api/offers/:id (Private: Update Offer)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const offer = await prisma.offer.findUnique({ where: { id: req.params.id } })
    if (!offer) return res.status(404).json({ message: 'Not found' })
    if (offer.ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    const body = z.object({
      title: z.string().min(3).optional(),
      address: z.string().min(5).optional(),
      pincode: z.number().int().positive().optional(),
      nearbyAreas: z.array(z.string()).optional(),
      discountPrice: z.number().positive().optional(),
      phoneNumber: z.string().length(10).optional(),
      description: z.string().min(5).optional(),
      imageUrls: z.array(z.string()).optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      status: z.string().optional()
    }).parse(req.body)

    const updated = await prisma.offer.update({
      where: { id: req.params.id },
      data: body
    })

    res.json({ item: updated })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/offers/:id (Private: Delete Offer)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const offer = await prisma.offer.findUnique({ where: { id: req.params.id } })
    if (!offer) return res.status(404).json({ message: 'Not found' })
    if (offer.ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    await prisma.offer.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// --- SOCIAL FEATURES ---

// GET /api/offers/saved (Private: Get saved offers for user)
router.get('/saved', requireAuth, async (req, res, next) => {
  try {
    const saved = await prisma.savedOffer.findMany({
      where: { userId: req.user.id },
      include: {
        offer: {
          include: {
            owner: { select: { name: true, email: true, businessName: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ items: saved.map(s => s.offer) })
  } catch (err) {
    next(err)
  }
})

// GET /api/offers/:id/like-status (Private: Get like/save status)
router.get('/:id/like-status', requireAuth, async (req, res, next) => {
  try {
    const offerId = req.params.id
    const userId = req.user.id

    const [likesCount, userLike, userSave] = await Promise.all([
      prisma.offerLike.count({ where: { offerId } }),
      prisma.offerLike.findUnique({ where: { offerId_userId: { offerId, userId } } }),
      prisma.savedOffer.findUnique({ where: { offerId_userId: { offerId, userId } } })
    ])

    res.json({
      likesCount,
      isLiked: !!userLike,
      isSaved: !!userSave
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/offers/:id/like (Private: Toggle Like)
router.post('/:id/like', requireAuth, async (req, res, next) => {
  try {
    const offerId = req.params.id
    const userId = req.user.id

    const existing = await prisma.offerLike.findUnique({
      where: { offerId_userId: { offerId, userId } }
    })

    if (existing) {
      await prisma.offerLike.delete({ where: { id: existing.id } })
      res.json({ isLiked: false })
    } else {
      await prisma.offerLike.create({ data: { offerId, userId } })
      res.json({ isLiked: true })
    }
  } catch (err) {
    next(err)
  }
})

// POST /api/offers/:id/save (Private: Toggle Save)
router.post('/:id/save', requireAuth, async (req, res, next) => {
  try {
    const offerId = req.params.id
    const userId = req.user.id

    const existing = await prisma.savedOffer.findUnique({
      where: { offerId_userId: { offerId, userId } }
    })

    if (existing) {
      await prisma.savedOffer.delete({ where: { id: existing.id } })
      res.json({ isSaved: false })
    } else {
      await prisma.savedOffer.create({ data: { offerId, userId } })
      res.json({ isSaved: true })
    }
  } catch (err) {
    next(err)
  }
})

// GET /api/offers/:id/comments (Public/Private: Get comments)
router.get('/:id/comments', async (req, res, next) => {
  try {
    const comments = await prisma.offerComment.findMany({
      where: { offerId: req.params.id },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ items: comments })
  } catch (err) {
    next(err)
  }
})

// POST /api/offers/:id/comments (Private: Add Comment)
router.post('/:id/comments', requireAuth, async (req, res, next) => {
  try {
    const body = z.object({ comment: z.string().min(1) }).parse(req.body)
    const comment = await prisma.offerComment.create({
      data: {
        offerId: req.params.id,
        userId: req.user.id,
        comment: body.comment
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } }
      }
    })
    res.status(201).json({ item: comment })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/offers/comments/:commentId (Private: Delete Comment)
router.delete('/comments/:commentId', requireAuth, async (req, res, next) => {
  try {
    const commentId = req.params.commentId
    const comment = await prisma.offerComment.findUnique({ where: { id: commentId } })
    if (!comment) return res.status(404).json({ message: 'Not found' })
    if (comment.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    await prisma.offerComment.delete({ where: { id: commentId } })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
