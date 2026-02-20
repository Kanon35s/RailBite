const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, default: '' }
      }
    ],
    contactInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    orderType: {
      type: String,
      enum: ['train', 'station'],
      default: 'train'
    },
    bookingDetails: {
      passengerName: { type: String, default: '' },
      phone: { type: String, default: '' },
      trainNumber: { type: String, default: '' },
      coachNumber: { type: String, default: '' },
      seatNumber: { type: String, default: '' },
      pickupStation: { type: String, default: '' }
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'mobile', 'card'],
      default: 'cash'
    },
    paymentInfo: {
      provider: { type: String, default: '' },
      transactionId: { type: String, default: '' },
      cardLastFour: { type: String, default: '' },
      cardholderName: { type: String, default: '' }
    },
    subtotal: { type: Number, required: true },
    vat: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 50 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled'],
      default: 'pending'
    },
    deliveryStatus: {
      type: String,
      enum: ['preparing', 'sent', 'delivered', ''],
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
