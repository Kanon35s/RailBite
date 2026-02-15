const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const DeliveryStaff = require('../models/DeliveryStaff'); // adjust if your model name/path differs

// All routes here require admin
router.use(protect, authorize('admin'));

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
      orderDate: { $gte: today },
    });

    const pendingOrders = await Order.countDocuments({
      status: { $in: ['placed', 'preparing'] },
    });

    const completedTodayAgg = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          orderDate: { $gte: today },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
        },
      },
    ]);

    const completedToday = completedTodayAgg[0]?.count || 0;
    const totalRevenue = completedTodayAgg[0]?.totalRevenue || 0;

    const activeUsers = await User.countDocuments({});
    const deliveryStaff = await DeliveryStaff.countDocuments({});

    res.json({
      success: true,
      data: {
        todayOrders,
        pendingOrders,
        completedOrders: completedToday,
        totalRevenue,
        activeUsers,
        deliveryStaff,
      },
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to load admin stats',
    });
  }
});

// GET /api/admin/reports/popular-items
router.get('/reports/popular-items', async (req, res) => {
  try {
    const topItems = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          orders: { $sum: '$items.quantity' },
          revenue: {
            $sum: { $multiply: ['$items.price', '$items.quantity'] },
          },
        },
      },
      { $sort: { orders: -1 } },
      { $limit: 5 },
    ]);

    const formatted = topItems.map((i) => ({
      name: i._id,
      orders: i.orders,
      revenue: i.revenue,
    }));

    res.json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    console.error('Popular items error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to load popular items',
    });
  }
});

module.exports = router;
