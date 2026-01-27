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
};
