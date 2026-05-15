const mongoose = require('mongoose')

const FavoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: {
      type: String,
      enum: ['rental', 'worker', 'offer', 'event', 'real-estate', 'materials'],
      required: true,
    },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
)

FavoriteSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true })

const Favorite = mongoose.model('Favorite', FavoriteSchema)
module.exports = { Favorite }

