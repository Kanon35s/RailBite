const DeliveryStaff = require('../models/DeliveryStaff');

// GET /api/delivery-staff
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await DeliveryStaff.find().sort({ createdAt: -1 });
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/delivery-staff
exports.createStaff = async (req, res) => {
  try {
    const { name, phone, vehicleType, vehicleNumber, status } = req.body;
    const staff = await DeliveryStaff.create({
      name,
      phone,
      vehicleType,
      vehicleNumber,
      status: status || 'available'
    });
    res.status(201).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/delivery-staff/:id
exports.updateStaff = async (req, res) => {
  try {
    const staff = await DeliveryStaff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/delivery-staff/:id
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await DeliveryStaff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }
    res.json({ success: true, message: 'Delivery staff deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
