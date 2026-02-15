const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/admin');
const {
  getAllUsers,
  updateUserAdmin,
  deleteUserAdmin,
} = require('../controllers/adminUserController');

router.get('/', protect, admin, getAllUsers);
router.put('/:id', protect, admin, updateUserAdmin);
router.delete('/:id', protect, admin, deleteUserAdmin);

module.exports = router;
