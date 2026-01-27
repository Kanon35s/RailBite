const Notification = require('../models/Notification');

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications?filter=unread
// @access  Private
exports.getMyNotifications = async (req, res) => {
  try {
    const { filter } = req.query;

    let query = { user: req.user.id };

    if (filter === 'unread') {
      query.read = false;
    } else if (filter === 'read') {
      query.read = true;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .populate('relatedOrder', 'orderId status');

    const unreadCount = await Notification.countDocuments({ user: req.user.id, read: false });
    const readCount = await Notification.countDocuments({ user: req.user.id, read: true });

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      readCount,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
    success: false,
    message: error.message
  });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all notifications
// @route   DELETE /api/notifications/clear-all
// @access  Private
exports.clearAllNotifications = async (req, res, next) => {
  try {
    const result = await Notification.deleteMany({ user: req.user.id });

    res.json({
      success: true,
      message: `${result.deletedCount} notification(s) cleared`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread/count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ 
      user: req.user.id, 
      read: false 
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/notifications/admin  (admin)
exports.getAllNotificationsAdmin = async (req, res, next) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/:id/read  (admin)
exports.markNotificationReadAdmin = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notifications/:id  (admin)
exports.deleteNotificationAdmin = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
};

