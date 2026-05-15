const express = require('express')
const { requireAuth, requireRole } = require('../middleware/auth')
const { User } = require('../models/User')

const router = express.Router()

router.get('/', requireAuth, requireRole('admin'), async (_req, res, next) => {
  try {
    const items = await User.find({}).select('-passwordHash').sort({ createdAt: -1 }).limit(200)
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

module.exports = router

