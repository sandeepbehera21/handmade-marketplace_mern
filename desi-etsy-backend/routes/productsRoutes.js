const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Public route to get all approved products
router.get('/', productsController.getAllProducts);

// Routes for artisans to manage their own products
router.get('/my-products', auth, productsController.getMyProducts);
router.post('/', auth, upload.single('image'), productsController.createProduct);
router.put('/:id', auth, productsController.updateProduct);
router.delete('/:id', auth, productsController.deleteProduct);

module.exports = router; 