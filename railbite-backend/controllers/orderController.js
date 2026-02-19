const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');

// GET /api/orders - all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/recent - recent orders for dashboard
exports.getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/my-orders - customer's own orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/orders - place a new order (customer)
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      contactInfo,
      orderType,
      bookingDetails,
      paymentMethod,
      paymentInfo,
      subtotal,
      vat,
      deliveryFee,
      total
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    // Generate unique order number
    const orderNumber = 'RB-' + Date.now().toString().slice(-6);

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items,
      contactInfo,
      orderType: orderType || 'train',
      bookingDetails: bookingDetails || {},
      paymentMethod: paymentMethod || 'cash',
      paymentInfo: paymentInfo || {},
      subtotal,
      vat: vat || 0,
      deliveryFee: deliveryFee || 50,
      totalAmount: total,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: {
        ...order.toObject(),
        orderId: order.orderNumber
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/orders/:id/status - update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, deliveryStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status) order.status = status;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;

    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id - get single order
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order;

    // Check if id is a valid MongoDB ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    if (isObjectId) {
      // Try finding by _id first
      order = await Order.findById(id).populate('user', 'name email');
    }

    // If not found by _id or not a valid ObjectId, try orderNumber
    if (!order) {
      order = await Order.findOne({ orderNumber: id }).populate('user', 'name email');
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only allow owner or admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    let order;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    if (isObjectId) {
      order = await Order.findById(id);
    }

    if (!order) {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

