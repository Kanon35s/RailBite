const express = require('express');
const router = express.Router();
const { 
  getMyNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  clearAllNotifications,
  getUnreadCount
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/', getMyNotifications);
router.get('/unread/count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/clear-all', clearAllNotifications);
router.delete('/:id', deleteNotification);

module.exports = router;


