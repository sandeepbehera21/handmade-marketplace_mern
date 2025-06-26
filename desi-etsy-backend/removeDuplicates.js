require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function removeDuplicates() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const products = await Product.find({});
    console.log('Total products before cleanup:', products.length);
    
    // Group products by name
    const productGroups = {};
    products.forEach(product => {
      if (!productGroups[product.name]) {
        productGroups[product.name] = [];
      }
      productGroups[product.name].push(product);
    });
    
    // Find duplicates and remove them
    let removedCount = 0;
    for (const [name, productList] of Object.entries(productGroups)) {
      if (productList.length > 1) {
        console.log(`\nFound ${productList.length} instances of "${name}"`);
        
        // Keep the first one, remove the rest
        const toRemove = productList.slice(1);
        for (const product of toRemove) {
          await Product.findByIdAndDelete(product._id);
          console.log(`  Removed: ${product._id}`);
          removedCount++;
        }
      }
    }
    
    const remainingProducts = await Product.find({});
    console.log(`\nCleanup complete!`);
    console.log(`Removed ${removedCount} duplicate products`);
    console.log(`Remaining products: ${remainingProducts.length}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

removeDuplicates(); 