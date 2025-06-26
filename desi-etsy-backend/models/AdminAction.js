const mongoose = require('mongoose');

const adminActionSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  targetType: { type: String, required: true }, // 'artisan', 'product', 'order'
  targetId: { type: String, required: true },
  details: { type: Object }, // optional, for extra info
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminAction', adminActionSchema); 