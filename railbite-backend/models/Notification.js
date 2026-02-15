<<<<<<< HEAD
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['order', 'promotion', 'system'],
    default: 'order'
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  link: String
}, {
  timestamps: true
});

// Indexes for faster queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });
=======
// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    targetGroup: {
      type: String,
      enum: ['all', 'users', 'staff'],
      required: true,
      default: 'all',
    },
    // Optional link for “View details”
    link: {
      type: String,
      default: null,
    },
    // Optional: who created it
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // For per-user delivery (optional)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryStaff',
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ targetGroup: 1, createdAt: -1 });
>>>>>>> parent of 4e40cd62 (latest update on backend completion)

module.exports = mongoose.model('Notification', notificationSchema);
