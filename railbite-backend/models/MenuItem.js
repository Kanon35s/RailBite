const mongoose = require('mongoose');

<<<<<<< HEAD
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item must have a name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please specify category'],
    enum: ['breakfast', 'lunch', 'dinner', 'snacks', 'biryani', 'burger', 'pizza', 'shwarma', 'beverage', 'smoothie']
  },
  price: {
    type: Number,
    required: [true, 'Menu item must have a price'],
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/images/default-food.jpg'
  },
  available: {
    type: Boolean,
    default: true
  },
  hasSubmenu: {
    type: Boolean,
    default: false
  },
  submenuPath: String
}, {
  timestamps: true
});

// Indexes for faster queries
menuItemSchema.index({ category: 1, available: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });
=======
const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    category: {
      type: String,
      enum: ['pizza', 'burger', 'smoothie', 'shwarma', 'beverage'],
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
>>>>>>> parent of 4e40cd62 (latest update on backend completion)

module.exports = mongoose.model('MenuItem', menuItemSchema);
