// railbite-backend/routes/adminReportRoutes.js
const express = require('express');
const router = express.Router();

const { getAdminReports } = require('../controllers/adminReportController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// All admin report routes require admin
router.use(protect, admin);

// GET /api/admin/reports
router.get('/', getAdminReports);

module.exports = router;
