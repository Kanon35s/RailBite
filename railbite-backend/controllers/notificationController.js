const Notification = require('../models/Notification');

// GET /api/notifications - get all (admin)
exports.getAll = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('sentBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/notifications - send notification (admin)
exports.send = async (req, res) => {
  try {
    const { type, title, message, targetUser } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    // Validate targetUser
    const validTargets = ['all', 'users', 'delivery', 'admin'];
    const target = validTargets.includes(targetUser) ? targetUser : 'all';

    const notification = await Notification.create({
      type: type || 'info',
      title,
      message,
      targetUser: target,
      sentBy: req.user._id
    });

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/notifications/:id - delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/notifications/customer - get notifications for customers
exports.getCustomerNotifications = async (req, res) => {
  try {
    // Get notifications targeting 'all' or the user's role
    const userRole = req.user.role;

    const notifications = await Notification.find({
      $or: [
        { targetUser: 'all' },
        { targetUser: 'users' },
        { targetUser: userRole }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
