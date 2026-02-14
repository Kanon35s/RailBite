// railbite-backend/controllers/adminReportController.js
const Order = require('../models/Order');
const DeliveryStaff = require('../models/DeliveryStaff');
const User = require('../models/User');

exports.getAdminReports = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const startOfMonth = new Date(startOfDay);
    startOfMonth.setDate(1);

    const [
      dailyOrders,
      weeklyOrders,
      monthlyOrders,
      delivered,
      pending,
      staff,
      users,
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Order.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({
        status: { $in: ['pending', 'confirmed', 'preparing', 'ready', 'ontheway'] },
      }),
      DeliveryStaff.find().select('name type status completedToday'),
      User.find().select('createdAt status'),
    ]);

    res.json({
      success: true,
      data: {
        orders: {
          daily: dailyOrders,
          weekly: weeklyOrders,
          monthly: monthlyOrders,
          delivered,
          pending,
        },
        staffPerformance: staff,
        userActivity: {
          totalUsers: users.length,
          activeUsers: users.filter((u) => u.status === 'active').length,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
