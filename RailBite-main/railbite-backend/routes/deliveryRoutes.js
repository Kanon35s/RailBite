const express = require('express');
const router = express.Router();
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

module.exports = router;
