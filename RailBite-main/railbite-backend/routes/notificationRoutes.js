const express = require('express');
const router = express.Router();

const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
  getAllNotificationsAdmin,
  markNotificationReadAdmin,
  deleteNotificationAdmin,
  createNotificationAdmin, // <-- add
} = require('../controllers/notificationController');

const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// All user routes are protected
router.use(protect);

// User routes
router.get('/', getMyNotifications);
router.get('/unread/count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/clear-all', clearAllNotifications);
router.delete('/:id', deleteNotification);

// Admin endpoints
router.get('/admin/all', admin, getAllNotificationsAdmin);
router.put('/admin/:id/read', admin, markNotificationReadAdmin);
router.delete('/admin/:id', admin, deleteNotificationAdmin);
router.post('/admin', admin, createNotificationAdmin); // <-- new

module.exports = router;
