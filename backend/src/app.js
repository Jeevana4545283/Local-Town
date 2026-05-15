require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')

const { notFound, errorHandler } = require('./middleware/errors')
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/users.routes')
const rentalRoutes = require('./routes/rentals.routes')
const workerRoutes = require('./routes/workers.routes')
const offerRoutes = require('./routes/offers.routes')
const eventRoutes = require('./routes/events.routes')
const serviceRoutes = require('./routes/services.routes')
const emergencyRoutes = require('./routes/emergencies.routes')
const alertRoutes = require('./routes/alerts.routes')
const realEstateRoutes = require('./routes/realestate.routes')
const materialRoutes = require('./routes/materials.routes')
const reviewRoutes = require('./routes/reviews.routes')
const favoriteRoutes = require('./routes/favorites.routes')
const notificationRoutes = require('./routes/notifications.routes')
const paymentRoutes = require('./routes/payments.routes')
const aiRoutes = require('./routes/ai.routes')

const app = express()

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
app.use('/api/workers', workerRoutes)
app.use('/api/offers', offerRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/emergencies', emergencyRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/real-estate', realEstateRoutes)
app.use('/api/materials', materialRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/ai', aiRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = { app }

