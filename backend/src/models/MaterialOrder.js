const mongoose = require('mongoose')

const MaterialItemSchema = new mongoose.Schema(
  {
    material: { type: String, enum: ['cement', 'sand', 'bricks', 'steel'], required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, default: 'unit', trim: true },
  },
  { _id: false },
)

const MaterialOrderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [MaterialItemSchema], default: [] },
    deliveryAddress: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'out-for-delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    amount: { type: Number, default: 0, min: 0 },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  },
  { timestamps: true },
)

MaterialOrderSchema.index({ buyer: 1, createdAt: -1 })

const MaterialOrder = mongoose.model('MaterialOrder', MaterialOrderSchema)
module.exports = { MaterialOrder }

