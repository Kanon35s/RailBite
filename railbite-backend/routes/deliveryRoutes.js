// railbite-backend/routes/deliveryRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/deliveryController');

const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// All delivery staff routes are admin-only
router.use(protect, admin);

// @route   GET /api/delivery
// @desc    Get all delivery staff
router.get('/', getAllStaff);

// @route   POST /api/delivery
// @desc    Create delivery staff
router.post('/', createStaff);

// @route   PUT /api/delivery/:id
// @desc    Update delivery staff
router.put('/:id', updateStaff);

// @route   DELETE /api/delivery/:id
// @desc    Delete delivery staff
router.delete('/:id', deleteStaff);

module.exports = router;
