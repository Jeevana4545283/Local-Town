require('dotenv').config()

const express = require('express')
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')

const { notFound, errorHandler } = require('./middleware/errors')
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/users.routes')
const rentalRoutes = require('./routes/rentals.routes')
const marketplaceRoutes = require('./routes/marketplace.routes')
const marketplaceBookingsRoutes = require('./routes/marketplace_bookings.routes')
const bookingRoutes = require('./routes/bookings.routes')
const workerRoutes = require('./routes/workers.routes')
const workerBookingsRoutes = require('./routes/workers_bookings.routes')
const offerRoutes = require('./routes/offers.routes')
const offerBookingsRoutes = require('./routes/offers_bookings.routes')
const eventRoutes = require('./routes/events.routes')
const eventBookingsRoutes = require('./routes/events_bookings.routes')
const serviceRoutes = require('./routes/services.routes')
const serviceBookingsRoutes = require('./routes/services_bookings.routes')
const notificationRoutes = require('./routes/notifications.routes')
const paymentRoutes = require('./routes/payments.routes')
const aiRoutes = require('./routes/ai.routes')
const chatRoutes = require('./routes/chat.routes')
const profileRoutes = require('./routes/profile.routes')

const app = express()
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')))

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
    credentials: true,
  }),
)
app.use(helmet())
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/rentals', rentalRoutes)
app.use('/api/marketplace', marketplaceRoutes)
app.use('/api/marketplace-bookings', marketplaceBookingsRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/workers', workerRoutes)
app.use('/api/workers-bookings', workerBookingsRoutes)
app.use('/api/offers', offerRoutes)
app.use('/api/offers-bookings', offerBookingsRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/events-bookings', eventBookingsRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/services-bookings', serviceBookingsRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/conversations', chatRoutes)
app.use('/api/profile', profileRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = { app }

