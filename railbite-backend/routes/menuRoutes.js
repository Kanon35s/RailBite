const express = require('express');
const router = express.Router();
const {
  getAllMenu,
  getMenuByCategory,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getAllMenu);
router.get('/category/:category', getMenuByCategory);
router.get('/:id', getMenuItem);

// Admin only routes
router.post('/', protect, admin, createMenuItem);
router.put('/:id', protect, admin, updateMenuItem);
router.delete('/:id', protect, admin, deleteMenuItem);

module.exports = router;
