const mongoose = require('mongoose');
const crypto = require('crypto');

const passwordResetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resetToken: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  used: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for cleanup
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Generate reset token
passwordResetSchema.methods.createResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
