const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { protect, admin } = require('../middleware/admin');
const {
  getAllUsers,
  updateUserAdmin,
  deleteUserAdmin,
} = require('../controllers/adminUserController');

router.get('/', protect, admin, getAllUsers);
router.put('/:id', protect, admin, updateUserAdmin);
router.delete('/:id', protect, admin, deleteUserAdmin);
=======
const { protect, admin } = require('../middleware/auth');
const {
  getAllUsers,
  updateUserStatus,
  deleteUser,
} = require('../controllers/adminUserController');

router.get('/admin/users', protect, admin, getAllUsers);
router.put('/admin/users/:id/status', protect, admin, updateUserStatus);
router.delete('/admin/users/:id', protect, admin, deleteUser);
>>>>>>> parent of 4e40cd62 (latest update on backend completion)

module.exports = router;
