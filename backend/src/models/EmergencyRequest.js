const mongoose = require('mongoose')

const EmergencyRequestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['ambulance', 'police', 'women-safety', 'fire'],
      required: true,
    },
    address: { type: String, required: true, trim: true },
    details: { type: String, trim: true },
    status: { type: String, enum: ['open', 'dispatched', 'resolved', 'cancelled'], default: 'open' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'high' },
  },
  { timestamps: true },
)

EmergencyRequestSchema.index({ type: 1, status: 1 })

const EmergencyRequest = mongoose.model('EmergencyRequest', EmergencyRequestSchema)
module.exports = { EmergencyRequest }

