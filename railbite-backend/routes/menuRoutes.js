const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getAllMenu,
  getMenuByCategory,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');
const { protect, admin } = require('../middleware/auth');

// Multer config for menu images
const uploadDir = path.join(__dirname, '..', 'uploads', 'menu');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `menu-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Public routes
router.get('/', getAllMenu);
router.get('/category/:category', getMenuByCategory);
router.get('/:id', getMenuItem);

// Admin only routes (with optional image upload)
router.post('/', protect, admin, upload.single('image'), createMenuItem);
router.put('/:id', protect, admin, upload.single('image'), updateMenuItem);
router.delete('/:id', protect, admin, deleteMenuItem);

module.exports = router;
