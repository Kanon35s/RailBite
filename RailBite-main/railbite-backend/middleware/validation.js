const { body, validationResult } = require('express-validator');

// Validation middleware to check for errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  next();
};

// Registration validation
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').matches(/^(\+?880|0)?1[3-9]\d{8}$/).withMessage('Please provide a valid Bangladeshi phone number'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  validate
];

// Login validation
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Order validation
const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('contactInfo.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('contactInfo.email').isEmail().withMessage('Valid email is required'),
  body('contactInfo.phone').notEmpty().withMessage('Phone number is required'),
  body('orderType').isIn(['train', 'station']).withMessage('Order type must be train or station'),
  body('paymentMethod').isIn(['cash', 'mobile', 'card']).withMessage('Invalid payment method'),
  body('subtotal').isNumeric().withMessage('Subtotal must be a number'),
  body('vat').isNumeric().withMessage('VAT must be a number'),
  body('total').isNumeric().withMessage('Total must be a number'),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  orderValidation
};
