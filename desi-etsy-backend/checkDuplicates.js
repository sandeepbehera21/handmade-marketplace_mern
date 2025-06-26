require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function checkDuplicates() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const products = await Product.find({});
    console.log('Total products:', products.length);
    
    const names = products.map(p => p.name);
    const uniqueNames = [...new Set(names)];
    console.log('Unique product names:', uniqueNames.length);
    
    if (names.length !== uniqueNames.length) {
      console.log('Duplicates found!');
      const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
      console.log('Duplicate names:', [...new Set(duplicates)]);
      
      // Show all products with duplicate names
      const duplicateNames = [...new Set(duplicates)];
      duplicateNames.forEach(name => {
        const duplicateProducts = products.filter(p => p.name === name);
        console.log(`\nProduct: ${name} (${duplicateProducts.length} instances)`);
        duplicateProducts.forEach((product, index) => {
          console.log(`  ${index + 1}. ID: ${product._id}, Price: ₹${product.price}, Category: ${product.category}`);
        });
      });
    } else {
      console.log('No duplicates found!');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkDuplicates(); 