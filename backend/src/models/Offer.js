const mongoose = require('mongoose')

const OfferSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    validUntil: { type: Date },
    imageUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

OfferSchema.index({ shopName: 'text', title: 'text', description: 'text' })

const Offer = mongoose.model('Offer', OfferSchema)
module.exports = { Offer }

