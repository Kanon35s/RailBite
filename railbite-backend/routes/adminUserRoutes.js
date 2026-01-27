const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getAllUsers,
  updateUserStatus,
  deleteUser,
} = require('../controllers/adminUserController');

router.get('/admin/users', protect, admin, getAllUsers);
router.put('/admin/users/:id/status', protect, admin, updateUserStatus);
router.delete('/admin/users/:id', protect, admin, deleteUser);

module.exports = router;
