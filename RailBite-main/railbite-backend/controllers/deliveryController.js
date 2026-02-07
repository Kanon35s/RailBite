const DeliveryStaff = require('../models/DeliveryStaff');

// GET /api/delivery (admin)
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await DeliveryStaff.find().sort({ createdAt: -1 });
    res.json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/delivery (admin)
exports.createStaff = async (req, res) => {
  try {
    const staff = await DeliveryStaff.create(req.body);
    res.status(201).json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/delivery/:id (admin)
exports.updateStaff = async (req, res) => {
  try {
    const staff = await DeliveryStaff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/delivery/:id (admin)
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await DeliveryStaff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.json({ success: true, message: 'Staff deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
