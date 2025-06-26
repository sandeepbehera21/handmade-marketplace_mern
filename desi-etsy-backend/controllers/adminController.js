const User = require('../models/User');
const Product = require('../models/Product');
const AdminAction = require('../models/AdminAction');

// Get all artisans pending verification
exports.getPendingArtisans = async (req, res) => {
  try {
    const pendingArtisans = await User.find({ role: 'artisan', isVerified: false });
    res.status(200).json(pendingArtisans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending artisans', error: error.message });
  }
};

// Verify an artisan
exports.verifyArtisan = async (req, res) => {
  try {
    const { userId } = req.params;
    const artisan = await User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
    if (!artisan) {
      return res.status(404).json({ message: 'Artisan not found' });
    }
    // Log admin action
    await AdminAction.create({
      adminId: req.user._id,
      action: 'verify artisan',
      targetType: 'artisan',
      targetId: userId
    });
    res.status(200).json({ message: 'Artisan verified successfully', artisan });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying artisan', error: error.message });
  }
};

// Get all products pending approval
exports.getPendingProducts = async (req, res) => {
  try {
    const pendingProducts = await Product.find({ isApproved: false }).populate('artisan', 'name');
    res.status(200).json(pendingProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending products', error: error.message });
  }
};

// Approve a product
exports.approveProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndUpdate(productId, { isApproved: true }, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // Log admin action
    await AdminAction.create({
      adminId: req.user._id,
      action: 'approve product',
      targetType: 'product',
      targetId: productId
    });
    res.status(200).json({ message: 'Product approved successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error approving product', error: error.message });
  }
};

// Delete (cancel) an artisan
exports.deleteArtisan = async (req, res) => {
  try {
    const { userId } = req.params;
    const artisan = await User.findOneAndDelete({ _id: userId, role: 'artisan', isVerified: false });
    if (!artisan) {
      return res.status(404).json({ message: 'Pending artisan not found or already verified.' });
    }
    // Log admin action
    await AdminAction.create({
      adminId: req.user._id,
      action: 'cancel artisan',
      targetType: 'artisan',
      targetId: userId
    });
    res.status(200).json({ message: 'Artisan request cancelled and removed.' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling artisan request', error: error.message });
  }
}; 