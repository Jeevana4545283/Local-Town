const { Server } = require('socket.io')
const { verifyJwt } = require('./utils/jwt')

let io = null

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
      credentials: true,
    },
  })

  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers.authorization || '').replace(/^Bearer\s+/i, '')

    if (!token) return next()
    try {
      socket.user = verifyJwt(token)
      return next()
    } catch {
      return next()
    }
  })

  io.on('connection', (socket) => {
    const userId = socket.user?.sub
    if (userId) socket.join(`user:${userId}`)
  })

  return io
}

function getIo() {
  if (!io) throw new Error('Socket.io not initialized')
  return io
}

module.exports = { initSocket, getIo }

