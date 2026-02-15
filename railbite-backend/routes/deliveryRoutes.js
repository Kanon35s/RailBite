const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { protect, admin } = require('../middleware/admin');
const {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/deliveryController');

router.route('/')
  .get(protect, admin, getAllStaff)
  .post(protect, admin, createStaff);

router.route('/:id')
  .put(protect, admin, updateStaff)
  .delete(protect, admin, deleteStaff);
=======
const { protectDelivery } = require('../middleware/deliveryAuth'); // middleware to decode staff JWT
const {
  getAvailableOrdersForStaff,
  acceptOrderByStaff,
  getStaffDeliveryHistory,
} = require('../controllers/deliveryController');

router.get('/orders/available', protectDelivery, getAvailableOrdersForStaff);
router.post('/orders/:orderId/accept', protectDelivery, acceptOrderByStaff);
router.get('/orders/history', protectDelivery, getStaffDeliveryHistory);
>>>>>>> parent of 4e40cd62 (latest update on backend completion)

module.exports = router;
