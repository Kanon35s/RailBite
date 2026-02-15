const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
<<<<<<< HEAD
      required: false,        // ← make this NOT required at schema level
      unique: true
=======
      required: true,
      unique: true,
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
<<<<<<< HEAD
      required: true
    },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: String
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
      required: true
    },
    // Conditional validation based on orderType
=======
      required: true,
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        image: String,
      },
    ],
    contactInfo: {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },

    // Existing type (train / station)
    orderType: {
      type: String,
      enum: ['train', 'station'],
      required: true,
    },

    // Delivery fields for staff dashboard
    deliveryType: {
      type: String,
      enum: ['train', 'station'],
      required: true,
    },
    deliveryStatus: {
      type: String,
      enum: ['pending', 'sent', 'delivered'],
      default: 'pending',
    },
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryStaff',
      default: null,
    },

>>>>>>> parent of 4e40cd62 (latest update on backend completion)
    bookingDetails: {
      passengerName: {
        type: String,
        required: function () {
          return this.orderType === 'train' || this.orderType === 'station';
<<<<<<< HEAD
        }
=======
        },
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
      },
      phone: {
        type: String,
        required: function () {
          return this.orderType === 'train' || this.orderType === 'station';
<<<<<<< HEAD
        }
=======
        },
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
      },
      trainNumber: {
        type: String,
        required: function () {
          return this.orderType === 'train' || this.orderType === 'station';
<<<<<<< HEAD
        }
=======
        },
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
      },
      coachNumber: {
        type: String,
        required: function () {
          return this.orderType === 'train' || this.orderType === 'station';
<<<<<<< HEAD
        }
=======
        },
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
      },
      seatNumber: {
        type: String,
        required: function () {
          return this.orderType === 'train' || this.orderType === 'station';
<<<<<<< HEAD
        }
      },
      // Only required for station orders
=======
        },
      },
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
      pickupStation: {
        type: String,
        required: function () {
          return this.orderType === 'station';
<<<<<<< HEAD
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
        enum: ['bkash', 'nagad', 'rocket', 'upay'],
        required: function () {
          return this.paymentMethod === 'mobile';
        }
=======
        },
      },
    },

    paymentMethod: {
      type: String,
      enum: ['cash', 'mobile', 'card'],
      required: true,
    },
    paymentInfo: {
      provider: {
        type: String,
        enum: ['bkash', 'nagad', 'rocket'],
        required: function () {
          return this.paymentMethod === 'mobile';
        },
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
      },
      transactionId: {
        type: String,
        required: function () {
          return this.paymentMethod === 'mobile';
        },
<<<<<<< HEAD
        minlength: 8
=======
        minlength: function () {
          return this.paymentMethod === 'mobile' ? 8 : 0;
        },
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
      },
      cardLastFour: {
        type: String,
        required: function () {
          return this.paymentMethod === 'card';
        },
<<<<<<< HEAD
        minlength: 4,
        maxlength: 4
=======
        minlength: function () {
          return this.paymentMethod === 'card' ? 4 : 0;
        },
        maxlength: function () {
          return this.paymentMethod === 'card' ? 4 : undefined;
        },
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
      },
      cardholderName: {
        type: String,
        required: function () {
          return this.paymentMethod === 'card';
<<<<<<< HEAD
        }
      }
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
=======
        },
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
    },
    vat: {
      type: Number,
      required: true,
<<<<<<< HEAD
      min: 0
=======
      min: 0,
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
    },
    deliveryFee: {
      type: Number,
      default: 50,
<<<<<<< HEAD
      min: 0
=======
      min: 0,
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
    },
    total: {
      type: Number,
      required: true,
<<<<<<< HEAD
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
  },
  { timestamps: true }
);

// Generate order ID before saving
=======
      min: 0,
    },

    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'ontheway',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },

    estimatedDeliveryTime: Date,
    deliveredAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

// Generate order ID and sync deliveryType
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    this.orderId = `RB${Math.floor(100000 + Math.random() * 900000)}`;
  }
<<<<<<< HEAD
  next();
});

// Indexes for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });
=======
  if (!this.deliveryType) {
    this.deliveryType = this.orderType;
  }
  next();
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ deliveryType: 1, deliveryStatus: 1 });
orderSchema.index({ assignedStaff: 1, deliveryStatus: 1 });
>>>>>>> parent of 4e40cd62 (latest update on backend completion)

module.exports = mongoose.model('Order', orderSchema);
