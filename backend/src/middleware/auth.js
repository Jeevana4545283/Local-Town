const { verifyJwt } = require('../utils/jwt')
const { User } = require('../models/User')

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const decoded = verifyJwt(token)
    const user = await User.findById(decoded.sub).select('-passwordHash')
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    const role = req.user?.role
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    next()
  }
}

module.exports = { requireAuth, requireRole }

