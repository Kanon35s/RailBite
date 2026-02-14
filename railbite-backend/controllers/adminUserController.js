// railbite-backend/controllers/adminUserController.js
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Admin
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id/role
// @access  Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role, status } = req.body; // role optional, status optional

    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (role) {
      user.role = role; // e.g. 'user' | 'admin'
    }

    if (status) {
      if (!['active', 'blocked'].includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid status' });
      }
      user.status = status;
    }

    await user.save();

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
