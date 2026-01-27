// routes/adminReportRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { getAdminReports } = require('../controllers/adminReportController');

router.get('/admin/reports', protect, admin, getAdminReports);

module.exports = router;
