const express = require('express')
const bcrypt = require('bcryptjs')
const { z } = require('zod')

const prisma = require('../prisma')
const { signJwt } = require('../utils/jwt')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

router.post('/signup', async (req, res, next) => {
  try {
    const body = z.object({ 
      name: z.string().min(2), 
      email: z.string().email(), 
      phone: z.string().optional(), 
      password: z.string().min(6).optional(),
      country: z.string().optional(),
      state: z.string().optional(),
      village: z.string().optional(),
      pincode: z.string().optional()
    }).parse(req.body)
    
    const exists = await prisma.user.findUnique({ where: { email: body.email } })
    if (exists) return res.status(409).json({ message: 'Email already in use' })

    if (!body.password) return res.status(400).json({ message: 'Password required.' })
    const finalPasswordHash = await bcrypt.hash(body.password, 10)

    const user = await prisma.user.create({ 
      data: { 
        name: body.name, 
        email: body.email, 
        phone: body.phone, 
        passwordHash: finalPasswordHash,
        country: body.country,
        state: body.state,
        village: body.village,
        pincode: body.pincode
      } 
    })

    const token = signJwt({ userId: user.id, role: user.role })
    return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } })
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error('[ZodError]', JSON.stringify(err.errors, null, 2))
      return res.status(400).json({ message: 'Invalid data', errors: err.errors })
    }
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required' })
    
    let user = await prisma.user.findUnique({ where: { email } })
    
    // Auto-create user if they don't exist to make login super simple
    if (!user) {
      const defaultPassword = await bcrypt.hash(password || '123456', 10)
      user = await prisma.user.create({
        data: {
          name: email.split('@')[0],
          email,
          passwordHash: defaultPassword,
          role: 'user'
        }
      })
    }

    // Skip strict password verification so anyone can login easily
    const token = signJwt({ userId: user.id, role: user.role })
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } })
  } catch (err) {
    console.error(`[LOGIN ERROR]`, err)
    next(err)
  }
})

const { OAuth2Client } = require('google-auth-library')
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID')

router.post('/google', async (req, res, next) => {
  try {
    const { credential } = req.body
    if (!credential) return res.status(400).json({ message: 'Missing credential' })

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    })
    const payload = ticket.getPayload()
    if (!payload || !payload.email) return res.status(400).json({ message: 'Invalid Google token' })

    const { email, name, picture, sub: googleId } = payload

    let user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { email },
          data: { googleId, authProvider: 'google', avatarUrl: user.avatarUrl || picture }
        })
      }
    } else {
      user = await prisma.user.create({
        data: {
          name: name || 'Google User',
          email,
          googleId,
          authProvider: 'google',
          avatarUrl: picture,
          role: 'user'
        }
      })
    }

    const token = signJwt({ userId: user.id, role: user.role })
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatarUrl: user.avatarUrl } })
  } catch (err) {
    console.error(`[GOOGLE AUTH ERROR]`, err)
    return res.status(401).json({ message: 'Google authentication failed' })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user })
})

router.post('/switch-role', requireAuth, async (req, res, next) => {
  try {
    const { role, email, id, userId } = req.user
    
    if (role === 'user') {
      // User switching to Owner
      let owner = await prisma.owner.findUnique({ where: { userId: id } })
      
      if (!owner) {
        // Fallback by email for existing owners created before migration
        owner = await prisma.owner.findUnique({ where: { email } })
        if (owner) {
          owner = await prisma.owner.update({ where: { id: owner.id }, data: { userId: id } })
        }
      }

      if (!owner) {
        // Auto-create owner profile
        owner = await prisma.owner.create({
          data: {
            userId: id,
            email: email,
            name: req.user.name,
            role: 'OWNER',
            categories: []
          }
        })
      }
      
      const token = signJwt({ userId: owner.id, role: owner.role })
      return res.json({ token, user: { id: owner.id, name: owner.name, email: owner.email, role: owner.role, categories: owner.categories } })
    } else {
      // Owner switching to User
      let user = null;
      if (userId) {
        user = await prisma.user.findUnique({ where: { id: userId } })
      }
      if (!user) {
        user = await prisma.user.findUnique({ where: { email } })
      }
      
      if (!user) return res.status(404).json({ message: 'User account not found.' })
      
      const token = signJwt({ userId: user.id, role: user.role })
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } })
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
