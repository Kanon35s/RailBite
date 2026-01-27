const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getMenuAdmin,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/adminMenuController');

// Admin menu CRUD
router.get('/admin/menu', protect, admin, getMenuAdmin);
router.post('/admin/menu', protect, admin, createMenuItem);
router.put('/admin/menu/:id', protect, admin, updateMenuItem);
router.delete('/admin/menu/:id', protect, admin, deleteMenuItem);

module.exports = router;
