const express = require("express");
const { register, login } = require("../controllers/authController");
const userProfileController = require('../controllers/userProfileController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post("/register", register);
router.post("/login", login);

// User profile routes
router.get('/profile', auth, userProfileController.getProfile);
router.put('/profile', auth, upload.single('profileImage'), userProfileController.updateProfile);

module.exports = router;
