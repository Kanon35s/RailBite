// railbite-backend/controllers/deliveryStaffController.js
const DeliveryStaff = require('../models/DeliveryStaff');

exports.getAllDeliveryStaff = async (req, res, next) => {
  try {
    const staff = await DeliveryStaff.find().sort({ createdAt: -1 });
    res.json({ success: true, data: staff });
  } catch (err) {
    next(err);
  }
};

exports.createDeliveryStaff = async (req, res, next) => {
  try {
    const { name, phone, type, vehicle } = req.body;

    if (!name || !phone || !type) {
      return res
        .status(400)
        .json({ success: false, message: 'Name, phone and type are required' });
    }

    const staff = await DeliveryStaff.create({
      name,
      phone,
      type,                         // 'train' | 'station'
      vehicle: type === 'station' ? vehicle || '' : null,
    });

    res.status(201).json({ success: true, data: staff });
  } catch (err) {
    next(err);
  }
};

exports.deleteDeliveryStaff = async (req, res, next) => {
  try {
    const staff = await DeliveryStaff.findById(req.params.id);
    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: 'Staff not found' });
    }

    await staff.deleteOne();
    res.json({ success: true, message: 'Staff deleted successfully' });
  } catch (err) {
    next(err);
  }
};
