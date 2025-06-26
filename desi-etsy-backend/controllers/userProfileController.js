const User = require('../models/User');
const path = require('path');

// Get user profile info
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile info (with optional image upload)
exports.updateProfile = async (req, res) => {
  try {
    let { firstName, lastName, gender, mobile, addresses, location, craftType, bio } = req.body;
    // Parse addresses if sent as JSON string
    if (typeof addresses === 'string') {
      try {
        addresses = JSON.parse(addresses);
      } catch (e) {
        addresses = [];
      }
    }
    let updateData = { firstName, lastName, gender, mobile, addresses, location, craftType, bio };
    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 