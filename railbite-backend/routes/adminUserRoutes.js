// railbite-backend/routes/adminUserRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require('../controllers/adminUserController');

const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// All admin user routes require admin
router.use(protect, admin);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/', getAllUsers);

// @route   GET /api/admin/users/:id
// @desc    Get single user
// @access  Admin
router.get('/:id', getUserById);

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Admin
router.put('/:id/role', updateUserRole);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Admin
router.delete('/:id', deleteUser);

module.exports = router;
