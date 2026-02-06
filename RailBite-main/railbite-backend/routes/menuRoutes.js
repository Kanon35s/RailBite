const express = require('express');
const router = express.Router();

const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories,
  getMenuItemsByCategory,
} = require('../controllers/menuController');

const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// Public routes
router.get('/', getMenuItems);
router.get('/categories/list', getCategories);
router.get('/category/:category', getMenuItemsByCategory);
router.get('/:id', getMenuItem);

// Protected routes (Admin only)
router.post('/', protect, admin, createMenuItem);
router.put('/:id', protect, admin, updateMenuItem);
router.delete('/:id', protect, admin, deleteMenuItem);

module.exports = router;
