// railbite-backend/routes/deliveryStaffRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllDeliveryStaff,
  createDeliveryStaff,
  deleteDeliveryStaff,
} = require('../controllers/deliveryStaffController');

const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// All routes below are admin-only
router.use(protect, admin);

// Base path will be /api/admin/delivery-staff from server.js

// GET /api/admin/delivery-staff
router.get('/', getAllDeliveryStaff);

// POST /api/admin/delivery-staff
router.post('/', createDeliveryStaff);

// DELETE /api/admin/delivery-staff/:id
router.delete('/:id', deleteDeliveryStaff);

module.exports = router;
