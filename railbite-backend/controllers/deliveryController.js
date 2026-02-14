// railbite-backend/controllers/deliveryController.js
const DeliveryStaff = require('../models/DeliveryStaff');

// @desc    Get all delivery staff
// @route   GET /api/delivery
// @access  Private/Admin
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await DeliveryStaff.find().sort({ createdAt: -1 });
    res.json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create delivery staff
// @route   POST /api/delivery
// @access  Private/Admin
exports.createStaff = async (req, res) => {
  try {
    const staff = await DeliveryStaff.create(req.body);
    res.status(201).json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update delivery staff
// @route   PUT /api/delivery/:id
// @access  Private/Admin
exports.updateStaff = async (req, res) => {
  try {
    const staff = await DeliveryStaff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found',
      });
    }

    res.json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete delivery staff
// @route   DELETE /api/delivery/:id
// @access  Private/Admin
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await DeliveryStaff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found',
      });
    }

    res.json({ success: true, message: 'Staff deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
