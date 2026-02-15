<<<<<<< HEAD
=======
// models/DeliveryStaff.js
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
const mongoose = require('mongoose');

const deliveryStaffSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    vehicleType: { type: String, enum: ['bike', 'car', 'van'], required: true },
    vehicleNumber: { type: String, required: true },
    status: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
    assignedOrders: { type: Number, default: 0 },
    completedToday: { type: Number, default: 0 },
  },
  { timestamps: true }
);

=======
    staffId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    // 'train' or 'station'
    type: {
      type: String,
      enum: ['train', 'station'],
      required: true,
    },
    // Only for station staff
    vehicle: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['available', 'busy'],
      default: 'available',
    },
    completedToday: {
      type: Number,
      default: 0,
    },
    lastCompletedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

deliveryStaffSchema.pre('save', function (next) {
  if (!this.staffId) {
    this.staffId = `DS${Math.floor(100000 + Math.random() * 900000)}`;
  }
  next();
});

>>>>>>> parent of 4e40cd62 (latest update on backend completion)
module.exports = mongoose.model('DeliveryStaff', deliveryStaffSchema);
