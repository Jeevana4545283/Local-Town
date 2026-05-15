const mongoose = require('mongoose')

const WorkerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['electrician', 'plumber', 'painter', 'carpenter', 'labour'],
      required: true,
    },
    headline: { type: String, trim: true },
    serviceArea: { type: String, trim: true },
    priceNote: { type: String, trim: true },
    experienceYears: { type: Number, default: 0, min: 0 },
    isVerified: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true },
)

WorkerProfileSchema.index({ category: 1, isAvailable: 1 })

const WorkerProfile = mongoose.model('WorkerProfile', WorkerProfileSchema)
module.exports = { WorkerProfile }

