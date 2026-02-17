// railbite-backend/routes/adminMenuRoutes.js
const express = require('express');
const router = express.Router();

const {
  getMenuAdmin,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/adminMenuController');

const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// All routes below: /api/admin/menu...
router.use(protect, admin);

// GET /api/admin/menu
router.get('/', getMenuAdmin);

// POST /api/admin/menu
router.post('/', createMenuItem);

// PUT /api/admin/menu/:id
router.put('/:id', updateMenuItem);

// DELETE /api/admin/menu/:id
router.delete('/:id', deleteMenuItem);

module.exports = router;
