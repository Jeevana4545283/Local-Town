const mongoose = require('mongoose')

const RealEstateListingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    kind: { type: String, enum: ['plot', 'house', 'commercial'], required: true },
    areaSqFt: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
    address: { type: String, trim: true },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

RealEstateListingSchema.index({ title: 'text', description: 'text', address: 'text' })

const RealEstateListing = mongoose.model('RealEstateListing', RealEstateListingSchema)
module.exports = { RealEstateListing }

