const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  image: { type: String },
  artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isApproved: { type: Boolean, default: false },
  category: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  tags: [{ type: String }],
  dimensions: {
    width: { type: Number },
    height: { type: Number },
    depth: { type: Number }
  },
  material: { type: String },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema); 