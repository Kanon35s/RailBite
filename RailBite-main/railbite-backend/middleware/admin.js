const { protect } = require('./auth');

// Admin role check
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res
    .status(403)
    .json({ success: false, message: 'Admin access only' });
};

module.exports = { protect, admin };
