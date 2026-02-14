const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { orderValidation } = require('../middleware/validation');

// All order routes require authentication
router.use(protect);

// Order routes
router.post('/', orderValidation, orderController.createOrder);
router.get('/', orderController.getMyOrders);
router.get('/stats/me', orderController.getOrderStats);
router.get('/:orderId', orderController.getOrderById);
router.put('/:orderId/cancel', orderController.cancelOrder);

// Admin routes (add admin middleware later if needed)
router.put('/:orderId/status', orderController.updateOrderStatus);

module.exports = router;

