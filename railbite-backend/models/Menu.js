const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    category: {
        type: String,
        required: true,
        enum: [
            'breakfast',
            'lunch',
            'dinner',
            'biryani',
            'burger',
            'pizza',
            'shwarma',
            'beverage',
            'smoothie',
            'snacks',
            'other'
        ]
    },
    image: { type: String, default: '' },
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Menu', menuSchema);
