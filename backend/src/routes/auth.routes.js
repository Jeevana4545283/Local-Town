const express = require('express')
const bcrypt = require('bcryptjs')
const { z } = require('zod')
const { User } = require('../models/User')
const { signJwt } = require('../utils/jwt')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

router.post('/signup', async (req, res, next) => {
  try {
    const body = z
      .object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        password: z.string().min(6),
      })
      .parse(req.body)

    const exists = await User.findOne({ email: body.email })
    if (exists) return res.status(409).json({ message: 'Email already in use' })

    const passwordHash = await bcrypt.hash(body.password, 10)
    const user = await User.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
      passwordHash,
    })

    const token = signJwt({ sub: user._id.toString(), role: user.role })
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    })
  } catch (err) {
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const body = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body)
    const user = await User.findOne({ email: body.email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const ok = await bcrypt.compare(body.password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const token = signJwt({ sub: user._id.toString(), role: user.role })
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user })
})

module.exports = router

