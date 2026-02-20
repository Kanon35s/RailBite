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
const upload = require('../middleware/upload');

// Public routes
router.get('/', getAllMenu);
router.get('/category/:category', getMenuByCategory);
router.get('/:id', getMenuItem);

// Admin only routes — use upload.single('image') to handle file
router.post('/', protect, admin, upload.single('image'), createMenuItem);
router.put('/:id', protect, admin, upload.single('image'), updateMenuItem);
router.delete('/:id', protect, admin, deleteMenuItem);

module.exports = router;
