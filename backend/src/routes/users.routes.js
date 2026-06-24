const express = require('express')
const { requireAuth, requireRole } = require('../middleware/auth')
const prisma = require('../prisma')

const router = express.Router()

router.get('/', requireAuth, requireRole('admin'), async (_req, res, next) => {
  try {
    const items = await prisma.user.findMany({
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 200
    })
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

module.exports = router

