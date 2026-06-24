const express = require('express')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const { requireAuth } = require('../middleware/auth')
const prisma = require('../prisma')

const router = express.Router()

// GET /api/profile
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { id, role } = req.user

    if (role === 'OWNER') {
      const owner = await prisma.owner.findUnique({
        where: { id },
        include: {
          _count: {
            select: { rentals: true, bookings: true, workers: true, offers: true, events: true, services: true }
          }
        }
      })
      if (!owner) return res.status(404).json({ message: 'Owner not found' })
      const { password, ...safeOwner } = owner
      return res.json({ profile: safeOwner })
    } else {
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) return res.status(404).json({ message: 'User not found' })
      const { passwordHash, ...safeUser } = user
      return res.json({ profile: safeUser })
    }
  } catch (err) {
    next(err)
  }
})

// PUT /api/profile
router.put('/', requireAuth, async (req, res, next) => {
  try {
    const { id, role } = req.user
    const data = req.body

    if (role === 'OWNER') {
      const updated = await prisma.owner.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email,
          businessName: data.businessName,
          phone: data.phone,
          address: data.address,
          state: data.state,
          pincode: data.pincode,
          description: data.description,
          theme: data.theme,
          categories: data.categories,
          avatarUrl: data.avatarUrl
        }
      })
      const { password, ...safe } = updated
      return res.json({ profile: safe })
    } else {
      const updated = await prisma.user.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          country: data.country,
          state: data.state,
          village: data.village,
          pincode: data.pincode,
          theme: data.theme,
          avatarUrl: data.avatarUrl
        }
      })
      const { passwordHash, ...safe } = updated
      return res.json({ profile: safe })
    }
  } catch (err) {
    next(err)
  }
})

// PUT /api/profile/password
router.put('/password', requireAuth, async (req, res, next) => {
  try {
    const { id, role } = req.user
    const { currentPassword, newPassword } = req.body

    if (role === 'OWNER') {
      const owner = await prisma.owner.findUnique({ where: { id } })
      const isMatch = await bcrypt.compare(currentPassword, owner.password)
      if (!isMatch) return res.status(400).json({ message: 'Invalid current password' })
      const hash = await bcrypt.hash(newPassword, 10)
      await prisma.owner.update({ where: { id }, data: { password: hash } })
      return res.json({ success: true })
    } else {
      const user = await prisma.user.findUnique({ where: { id } })
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!isMatch) return res.status(400).json({ message: 'Invalid current password' })
      const hash = await bcrypt.hash(newPassword, 10)
      await prisma.user.update({ where: { id }, data: { passwordHash: hash } })
      return res.json({ success: true })
    }
  } catch (err) {
    next(err)
  }
})

// POST /api/profile/upload
router.post('/upload', requireAuth, async (req, res, next) => {
  try {
    const { imageBase64 } = req.body
    if (!imageBase64) return res.status(400).json({ message: 'No image provided' })

    const matches = imageBase64.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ message: 'Invalid base64 string' })
    }

    const type = matches[1]
    const data = Buffer.from(matches[2], 'base64')
    const fileName = `avatar-${req.user.id}-${Date.now()}.${type}`
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '../../uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const filePath = path.join(uploadsDir, fileName)
    fs.writeFileSync(filePath, data)

    const avatarUrl = `/uploads/${fileName}`
    res.json({ avatarUrl })
  } catch (err) {
    next(err)
  }
})

module.exports = router
