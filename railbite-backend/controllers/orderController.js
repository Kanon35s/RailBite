const Order = require('../models/Order');
const Notification = require('../models/Notification');
const DeliveryStaff = require('../models/DeliveryStaff');

// helper: update staff when order delivered
async function handleDeliveryStaffOnDelivered(order) {
  if (!order.assignedStaff) return;
  const staff = await DeliveryStaff.findById(order.assignedStaff);
  if (!staff) return;

  const today = new Date();
  const last = staff.lastCompletedDate;

  if (!last || last.toDateString() !== today.toDateString()) {
    staff.completedToday = 0;
  }

  staff.completedToday += 1;
  staff.lastCompletedDate = today;
  staff.status = 'available';

  await staff.save();
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
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
      total,
    } = req.body;

    const order = await Order.create({
      user: req.user.id,
      items,
      contactInfo,
      orderType,
      bookingDetails,
      paymentMethod,
      paymentInfo,
      subtotal,
      vat,
      deliveryFee: deliveryFee || 50,
      total,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000),
    });

    await Notification.create({
      user: req.user.id,
      title: 'Order Placed Successfully',
      message: `Your order #${order.orderId} has been placed and is being processed.`,
      type: 'order',
      relatedOrder: order._id,
      link: `/order-tracking/${order.orderId}`,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all orders for logged-in user
// @route   GET /api/orders?status=delivered
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query = { user: req.user.id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by orderId
// @route   GET /api/orders/:orderId
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:orderId/status
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;

    if (status === 'delivered') {
      order.deliveredAt = new Date();
      await handleDeliveryStaffOnDelivered(order);
    }

    if (status === 'cancelled') {
      order.cancelledAt = new Date();
    }

    await order.save();

    const statusMessages = {
      confirmed: 'Your order has been confirmed!',
      preparing: 'Your order is being prepared.',
      ready: 'Your order is ready for delivery!',
      ontheway: 'Your order is on the way!',
      delivered: 'Your order has been delivered. Enjoy your meal!',
      cancelled: 'Your order has been cancelled.',
    };

    if (statusMessages[status]) {
      await Notification.create({
        user: order.user,
        title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: statusMessages[status],
        type: 'order',
        relatedOrder: order._id,
        link: `/order-tracking/${order.orderId}`,
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:orderId/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message:
          'Order cannot be cancelled at this stage. Please contact support.',
      });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();

    await Notification.create({
      user: req.user.id,
      title: 'Order Cancelled',
      message: `Your order #${order.orderId} has been cancelled successfully.`,
      type: 'order',
      relatedOrder: order._id,
      link: `/order-history`,
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order statistics for user
// @route   GET /api/orders/stats/me
// @access  Private
exports.getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments({ user: req.user.id });
    const deliveredOrders = await Order.countDocuments({
      user: req.user.id,
      status: 'delivered',
    });
    const pendingOrders = await Order.countDocuments({
      user: req.user.id,
      status: {
        $in: ['pending', 'confirmed', 'preparing', 'ready', 'ontheway'],
      },
    });

    const totalSpent = await Order.aggregate([
      { $match: { user: req.user._id, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        deliveredOrders,
        pendingOrders,
        totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/admin/stats  (admin)
exports.getAdminStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });
    const pendingOrders = await Order.countDocuments({
      status: {
        $in: ['pending', 'confirmed', 'preparing', 'ready', 'ontheway'],
      },
    });
    const completedToday = await Order.countDocuments({
      createdAt: { $gte: today },
      status: 'delivered',
    });

    const revenueData = await Order.aggregate([
      { $match: { createdAt: { $gte: today }, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const todayRevenue = revenueData[0]?.total || 0;

    const activeUsers =
      await require('../models/User').countDocuments();

    res.json({
      success: true,
      data: {
        todayOrders,
        pendingOrders,
        completedOrders: completedToday,
        totalRevenue: todayRevenue.toFixed(2),
        activeUsers,
        deliveryStaff: 0,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/admin/recent?limit=5  (admin)
exports.getRecentOrders = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name email')
      .lean();

    const formatted = orders.map((order) => ({
      id: order.orderId,
      customer:
        order.contactInfo?.fullName ||
        order.user?.name ||
        'Customer',
      items: order.items?.length || 0,
      total: order.total,
      status: order.status,
      time: new Date(order.createdAt).toLocaleTimeString('en-BD'),
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/admin  (admin)
exports.getAllOrdersAdmin = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .lean();

    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

// PUT /api/orders/admin/:orderId/status  (admin)
exports.updateOrderStatusAdmin = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    order.status = status;

    if (status === 'delivered') {
      order.deliveredAt = new Date();
      await handleDeliveryStaffOnDelivered(order);
    }

    if (status === 'cancelled') {
      order.cancelledAt = new Date();
    }

    await order.save();

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};
