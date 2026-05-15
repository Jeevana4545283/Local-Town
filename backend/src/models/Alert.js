const mongoose = require('mongoose')

const AlertSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['power-cut', 'news'], required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    area: { type: String, trim: true },
    startsAt: { type: Date },
    endsAt: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

AlertSchema.index({ type: 1, createdAt: -1 })
AlertSchema.index({ title: 'text', message: 'text', area: 'text' })

const Alert = mongoose.model('Alert', AlertSchema)
module.exports = { Alert }

