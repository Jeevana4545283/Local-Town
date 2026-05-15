const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    data: { type: Object, default: {} },
    readAt: { type: Date },
  },
  { timestamps: true },
)

NotificationSchema.index({ user: 1, createdAt: -1 })

const Notification = mongoose.model('Notification', NotificationSchema)
module.exports = { Notification }

