const express = require('express');
const router = express.Router();
const {
  getAll,
  send,
  deleteNotification,
  getCustomerNotifications
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, admin, getAll);
router.get('/customer', protect, getCustomerNotifications);
router.post('/', protect, admin, send);
router.delete('/:id', protect, admin, deleteNotification);

module.exports = router;
