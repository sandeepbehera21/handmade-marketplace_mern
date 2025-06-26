const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const adminController = require('../controllers/adminController');
const contactController = require('../controllers/contactController');

// Artisan management
router.get('/artisans/pending', auth, isAdmin, adminController.getPendingArtisans);
router.put('/artisans/:userId/verify', auth, isAdmin, adminController.verifyArtisan);
router.delete('/artisans/:userId', auth, isAdmin, adminController.deleteArtisan);

// Product management
router.get('/products/pending', auth, isAdmin, adminController.getPendingProducts);
router.put('/products/:productId/approve', auth, isAdmin, adminController.approveProduct);

// Contact form submission (public, no auth required)
router.post('/contact', contactController.submitContactForm);

module.exports = router; 