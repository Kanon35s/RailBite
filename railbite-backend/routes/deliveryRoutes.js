const express = require('express');
const router = express.Router();
const { protectDelivery } = require('../middleware/deliveryAuth'); // middleware to decode staff JWT
const {
  getAvailableOrdersForStaff,
  acceptOrderByStaff,
  getStaffDeliveryHistory,
} = require('../controllers/deliveryController');

router.get('/orders/available', protectDelivery, getAvailableOrdersForStaff);
router.post('/orders/:orderId/accept', protectDelivery, acceptOrderByStaff);
router.get('/orders/history', protectDelivery, getStaffDeliveryHistory);

module.exports = router;
