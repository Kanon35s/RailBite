const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['promotion', 'alert', 'order', 'info'],
      default: 'info'
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    targetUser: { type: String, enum: ['all', 'users', 'delivery', 'admin'], default: 'all' },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
