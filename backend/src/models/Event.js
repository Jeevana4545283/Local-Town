const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date },
    venue: { type: String, trim: true },
    organizerName: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

EventSchema.index({ startsAt: 1 })
EventSchema.index({ title: 'text', description: 'text', venue: 'text' })

const Event = mongoose.model('Event', EventSchema)
module.exports = { Event }

