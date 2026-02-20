const mongoose = require('mongoose');

const deliveryStaffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleType: {
      type: String,
      enum: ['bike', 'car', 'van'],
      default: 'bike'
    },
    vehicleNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'available'
    },
    assignedOrders: { type: Number, default: 0 },
    completedToday: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeliveryStaff', deliveryStaffSchema);
