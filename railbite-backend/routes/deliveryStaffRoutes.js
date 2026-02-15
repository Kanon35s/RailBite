// routes/deliveryStaffRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getAllDeliveryStaff,
  createDeliveryStaff,
  deleteDeliveryStaff,
} = require('../controllers/deliveryStaffController');

// Admin manages delivery staff
router.get('/admin/delivery-staff', protect, admin, getAllDeliveryStaff);
router.post('/admin/delivery-staff', protect, admin, createDeliveryStaff);
router.delete('/admin/delivery-staff/:id', protect, admin, deleteDeliveryStaff);

module.exports = router;
