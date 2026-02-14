const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { orderValidation } = require('../middleware/validation');

// All order routes require authentication
router.use(protect);

// User routes
router.post('/', orderValidation, orderController.createOrder);
router.get('/', orderController.getMyOrders);
router.get('/stats/me', orderController.getOrderStats);
router.get('/:orderId', orderController.getOrderById);
router.put('/:orderId/cancel', orderController.cancelOrder);

// Admin routes
router.put('/:orderId/status', admin, orderController.updateOrderStatus);

// Admin analytics and management routes
router.get('/admin/stats', admin, orderController.getAdminStats);
router.get('/admin/recent', admin, orderController.getRecentOrders);
router.get('/admin', admin, orderController.getAllOrdersAdmin);
router.put('/admin/:orderId/status', admin, orderController.updateOrderStatusAdmin);

module.exports = router;
