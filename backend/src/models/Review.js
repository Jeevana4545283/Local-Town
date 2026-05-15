const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: {
      type: String,
      enum: ['rental', 'worker', 'offer', 'event', 'real-estate', 'materials'],
      required: true,
    },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true },
)

ReviewSchema.index({ targetType: 1, targetId: 1, createdAt: -1 })
ReviewSchema.index({ author: 1, targetType: 1, targetId: 1 }, { unique: true })

const Review = mongoose.model('Review', ReviewSchema)
module.exports = { Review }

