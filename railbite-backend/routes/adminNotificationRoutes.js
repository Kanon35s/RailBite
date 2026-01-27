// routes/adminNotificationRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createAdminNotification,
  getNotificationsForGroup,
} = require('../controllers/adminNotificationController');

// Admin creates notification
router.post('/admin/notifications', protect, admin, createAdminNotification);

// Dashboards fetch
router.get('/notifications/:group', protect, getNotificationsForGroup); // group = 'users' or 'staff'

module.exports = router;
