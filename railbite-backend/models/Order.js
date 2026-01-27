const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: String
  }],
  contactInfo: {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  orderType: {
    type: String,
    enum: ['train', 'station'],
    required: true
  },
  // Conditional validation based on orderType
  bookingDetails: {
    passengerName: {
      type: String,
      required: function() {
        return this.orderType === 'train' || this.orderType === 'station';
      }
    },
    phone: {
      type: String,
      required: function() {
        return this.orderType === 'train' || this.orderType === 'station';
      }
    },
    trainNumber: {
      type: String,
      required: function() {
        return this.orderType === 'train' || this.orderType === 'station';
      }
    },
    coachNumber: {
      type: String,
      required: function() {
        return this.orderType === 'train' || this.orderType === 'station';
      }
    },
    seatNumber: {
      type: String,
      required: function() {
        return this.orderType === 'train' || this.orderType === 'station';
      }
    },
    // Only required for station orders
    pickupStation: {
      type: String,
      required: function() {
        return this.orderType === 'station';
      }
    }
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'mobile', 'card'],
    required: true
  },
  // Conditional validation based on paymentMethod
  paymentInfo: {
    provider: {
      type: String,
      enum: ['bkash', 'nagad', 'rocket'],
      required: function() {
        return this.paymentMethod === 'mobile';
      }
    },
    transactionId: {
      type: String,
      required: function() {
        return this.paymentMethod === 'mobile';
      },
      minlength: function() {
        return this.paymentMethod === 'mobile' ? 8 : 0;
      }
    },
    cardLastFour: {
      type: String,
      required: function() {
        return this.paymentMethod === 'card';
      },
      minlength: function() {
        return this.paymentMethod === 'card' ? 4 : 0;
      },
      maxlength: function() {
        return this.paymentMethod === 'card' ? 4 : undefined;
      }
    },
    cardholderName: {
      type: String,
      required: function() {
        return this.paymentMethod === 'card';
      }
    }
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  vat: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryFee: {
    type: Number,
    default: 50,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'ontheway', 'delivered', 'cancelled'],
    default: 'pending'
  },
  estimatedDeliveryTime: Date,
  deliveredAt: Date,
  cancelledAt: Date
}, {
  timestamps: true
});

// Generate order ID before saving
orderSchema.pre('save', function(next) {
  if (!this.orderId) {
    this.orderId = `RB${Math.floor(100000 + Math.random() * 900000)}`;
  }
  next();
});

// Indexes for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
