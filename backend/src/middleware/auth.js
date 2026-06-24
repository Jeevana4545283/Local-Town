const { verifyJwt } = require('../utils/jwt')
const prisma = require('../prisma')

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const decoded = verifyJwt(token)
    
    // Check if it's an Owner
    let user = await prisma.owner.findUnique({
      where: { id: decoded.userId }
    })
    
    if (!user) {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      })
    }
    
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    
    // Remove password before attaching to req
    const { password, passwordHash, ...userWithoutPassword } = user
    req.user = userWithoutPassword
    next()
  } catch (err) {
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
