const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const PasswordReset = require('../models/PasswordReset');
const DeliveryStaff = require('../models/DeliveryStaff');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc Register new user
// @route POST /api/auth/register
// @access Public
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role, // important for frontend redirects
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role, // 'user' or 'admin'
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get current user
// @route GET /api/auth/me
// @access Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
// @access Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Request password reset
// @route POST /api/auth/forgot-password
// @access Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email',
      });
    }

    // Create reset token
    const passwordReset = new PasswordReset({ user: user._id });
    const resetToken = passwordReset.createResetToken();
    await passwordReset.save();

    // TODO: Send email with resetToken in production
    return res.status(200).json({
      success: true,
      message: 'Password reset email sent',
      resetToken, // remove in production and send via email
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Login delivery staff
// @route POST /api/auth/delivery/login
// @access Public
exports.loginDeliveryStaff = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email and password' });
    }

    const staff = await DeliveryStaff.findOne({ email }).select('+password');
    if (!staff) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await staff.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(staff._id);

    return res.status(200).json({
      success: true,
      message: 'Delivery staff login successful',
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        type: staff.type, // 'train' or 'station'
        role: 'delivery',
      },
    });
  } catch (err) {
    return next(err);
  }
};

// @desc Reset password
// @route POST /api/auth/reset-password
// @access Public
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reset token and new password',
      });
    }

    // Hash the token to match database
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Find valid reset token
    const passwordReset = await PasswordReset.findOne({
      resetToken: hashedToken,
      expiresAt: { $gt: Date.now() },
      used: false,
    });

    if (!passwordReset) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Update user password
    const user = await User.findById(passwordReset.user);
    user.password = newPassword;
    await user.save();

    // Mark token as used
    passwordReset.used = true;
    await passwordReset.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Logout user (client-side token removal)
// @route POST /api/auth/logout
// @access Private
exports.logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
