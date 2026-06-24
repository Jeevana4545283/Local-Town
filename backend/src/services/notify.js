const prisma = require('../prisma')
const { getIo } = require('../socket')

async function notifyUser(userId, payload) {
  const doc = await prisma.notification.create({
    data: {
      userId: userId,
      title: payload.title || 'Notification',
      message: payload.message || '',
      type: payload.type || 'SYSTEM'
    }
  })
  try {
    const io = getIo()
    io.to(`user:${userId}`).emit('notification:new', doc)
  } catch {
    // socket not initialized / ignore
  }
  return doc
}

async function notifyAllUsers(payload) {
  const users = await prisma.user.findMany({ select: { id: true } })
  await Promise.all(users.map((u) => notifyUser(u.id, payload)))
}

module.exports = { notifyUser, notifyAllUsers }

