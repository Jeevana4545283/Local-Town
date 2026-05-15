const { Notification } = require('../models/Notification')
const { User } = require('../models/User')
const { getIo } = require('../socket')

async function notifyUser(userId, payload) {
  const doc = await Notification.create({ user: userId, ...payload })
  try {
    const io = getIo()
    io.to(`user:${userId}`).emit('notification:new', doc)
  } catch {
    // socket not initialized / ignore
  }
  return doc
}

async function notifyAllUsers(payload) {
  const users = await User.find({}).select('_id')
  await Promise.all(users.map((u) => notifyUser(u._id.toString(), payload)))
}

module.exports = { notifyUser, notifyAllUsers }

