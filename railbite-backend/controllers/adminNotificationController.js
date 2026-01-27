// controllers/adminNotificationController.js
const Notification = require('../models/Notification');

exports.createAdminNotification = async (req, res, next) => {
  try {
    const { title, message, targetGroup, link } = req.body;

    if (!title || !message || !targetGroup) {
      return res.status(400).json({
        success: false,
        message: 'Title, message, and targetGroup are required',
      });
    }

    const notification = await Notification.create({
      title,
      message,
      targetGroup, // 'all' | 'users' | 'staff'
      link: link || null,
      createdBy: req.user?._id,
    });

    // TODO: If you later add WebSockets, emit here for instant delivery

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (err) {
    next(err);
  }
};

exports.getNotificationsForGroup = async (req, res, next) => {
  try {
    const group = req.params.group; // 'users' | 'staff'
    if (!['users', 'staff'].includes(group)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid group',
      });
    }

    const notifications = await Notification.find({
      $or: [{ targetGroup: 'all' }, { targetGroup: group }],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
};
