const mongoose = require('mongoose')

const ServiceRequestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['home-cleaning', 'waste-management'], required: true },
    address: { type: String, required: true, trim: true },
    preferredDate: { type: Date },
    notes: { type: String, trim: true },
    status: { type: String, enum: ['open', 'assigned', 'completed', 'cancelled'], default: 'open' },
    assignedToWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkerProfile' },
  },
  { timestamps: true },
)

ServiceRequestSchema.index({ requester: 1, status: 1 })

const ServiceRequest = mongoose.model('ServiceRequest', ServiceRequestSchema)
module.exports = { ServiceRequest }

