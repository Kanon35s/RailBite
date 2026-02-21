const express = require('express');
const router = express.Router();
const {
    createReview,
    getReviewByOrder,
    getMyReviews,
    getAllReviews,
    deleteReview,
    getReviewStats
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');

// Customer routes
router.post('/', protect, createReview);
router.get('/my-reviews', protect, getMyReviews);
router.get('/order/:orderId', protect, getReviewByOrder);

// Admin routes
router.get('/', protect, admin, getAllReviews);
router.get('/stats', protect, admin, getReviewStats);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;
