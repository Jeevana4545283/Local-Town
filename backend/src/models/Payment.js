const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: String, enum: ['stripe', 'qr'], required: true },
    purpose: { type: String, trim: true }, // e.g. "material-order"
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['created', 'pending', 'paid', 'failed', 'refunded'], default: 'created' },
    providerRef: { type: String, trim: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: true },
)

PaymentSchema.index({ user: 1, createdAt: -1 })

const Payment = mongoose.model('Payment', PaymentSchema)
module.exports = { Payment }

