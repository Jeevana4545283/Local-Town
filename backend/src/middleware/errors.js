const { ZodError } = require('zod')

function notFound(req, res, _next) {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` })
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  if (err.name === 'ZodError' || err instanceof ZodError) {
    return res.status(400).json({ message: 'Validation Error', errors: err.errors })
  }
  const status = err.status || 500
  const message = err.message || 'Server error'
  res.status(status).json({ message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined })
}

module.exports = { notFound, errorHandler }

