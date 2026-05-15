const mongoose = require('mongoose')

const GeoPointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: undefined }, // [lng, lat]
  },
  { _id: false },
)

const RentalListingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    kind: { type: String, enum: ['house', 'room'], required: true },
    address: { type: String, trim: true },
    location: { type: GeoPointSchema, default: undefined },
    rentPerMonth: { type: Number, required: true, min: 0 },
    deposit: { type: Number, default: 0, min: 0 },
    bedrooms: { type: Number, default: 0, min: 0 },
    bathrooms: { type: Number, default: 0, min: 0 },
    furnished: { type: Boolean, default: false },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

RentalListingSchema.index({ location: '2dsphere' })
RentalListingSchema.index({ title: 'text', description: 'text', address: 'text' })

const RentalListing = mongoose.model('RentalListing', RentalListingSchema)
module.exports = { RentalListing }

