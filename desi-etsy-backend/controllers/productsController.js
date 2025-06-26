const Product = require('../models/Product');

// Get all *approved* products for public view
exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    let filter = { isApproved: true, status: 'active' };
    if (category && category !== 'all') {
      if (category.includes(',')) {
        filter.category = { $in: category.split(',') };
      } else {
        filter.category = category;
      }
    }
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    const products = await Product.find(filter)
      .populate('artisan', 'name shopName');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching products.' });
  }
};

// Get all products for the logged-in artisan
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ artisan: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, status, category, stock, tags, material, isFeatured, dimensions } = req.body;
    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({ message: 'Name, price, category, and stock are required.' });
    }
    if (price < 0) {
      return res.status(400).json({ message: 'Price must be positive.' });
    }
    if (stock < 0) {
      return res.status(400).json({ message: 'Stock must be 0 or more.' });
    }
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }
    const product = new Product({
      name,
      description,
      price,
      status,
      image: imagePath,
      artisan: req.user.id,
      category,
      stock,
      tags: tags ? Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()) : [],
      material,
      isFeatured,
      dimensions: dimensions ? (typeof dimensions === 'string' ? JSON.parse(dimensions) : dimensions) : undefined
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(t => t.trim());
    }
    if (updateData.dimensions && typeof updateData.dimensions === 'string') {
      updateData.dimensions = JSON.parse(updateData.dimensions);
    }
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, artisan: req.user.id },
      updateData,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, artisan: req.user.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 