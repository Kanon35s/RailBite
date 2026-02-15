<<<<<<< HEAD
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
=======
const Order = require('../models/Order');
const DeliveryStaff = require('../models/DeliveryStaff');

exports.getAvailableOrdersForStaff = async (req, res) => {
  const staff = await DeliveryStaff.findById(req.staff.id); // set by protectDelivery

  const orders = await Order.find({
    deliveryType: staff.type,           // 'train' or 'station'
    deliveryStatus: 'pending',          // not yet sent
    assignedStaff: null,                // not locked
  }).sort({ orderDate: -1 });

  res.json({ success: true, orders });
};

exports.acceptOrderByStaff = async (req, res) => {
  const staffId = req.staff.id;
  const { orderId } = req.params;

  const staff = await DeliveryStaff.findById(staffId);

  if (staff.status === 'busy') {
    return res.status(400).json({
      success: false,
      message: 'You are already handling another order',
    });
  }

  const order = await Order.findOne({
    _id: orderId,
    assignedStaff: null,
    deliveryStatus: 'pending',
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order is no longer available',
    });
  }

  order.assignedStaff = staffId;
  order.deliveryStatus = 'sent';
  await order.save();

  staff.status = 'busy';
  await staff.save();

  res.json({
    success: true,
    message: 'Order accepted',
    order,
    staff: {
      id: staff._id,
      status: staff.status,
    },
  });
};

exports.getStaffDeliveryHistory = async (req, res) => {
  const staffId = req.staff.id;

  const orders = await Order.find({
    assignedStaff: staffId,
    deliveryStatus: 'delivered',
  }).sort({ deliveredAt: -1 });

  res.json({ success: true, orders });
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
};
