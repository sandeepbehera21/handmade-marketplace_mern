const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sandeep:sand345@cluster22d.z76gsju.mongodb.net/test?retryWrites=true&w=majority';

const sampleProducts = [
  {
    name: 'Handcrafted Terracotta Vase',
    category: 'Crafts',
    price: 799,
    description: 'A beautiful hand-painted terracotta vase perfect for your living room.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Traditional Jhumka Earrings',
    category: 'Jewellery',
    price: 499,
    description: 'Classic Indian jhumka earrings with intricate design.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Block Print Cotton Kurta',
    category: 'Fashion',
    price: 1199,
    description: 'Soft cotton kurta with traditional block print patterns.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Macrame Wall Hanging',
    category: 'Home Decor',
    price: 899,
    description: 'Handmade macrame wall hanging to add a boho touch to your home.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Brass Puja Thali Set',
    category: 'Crafts',
    price: 649,
    description: 'Traditional brass thali set for your daily rituals.',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Handwoven Cotton Dupatta',
    category: 'Fashion',
    price: 599,
    description: 'Elegant handwoven dupatta with vibrant colors.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Bamboo Craft Basket',
    category: 'Crafts',
    price: 349,
    description: 'Eco-friendly bamboo basket for multipurpose use.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Embroidered Cushion Cover',
    category: 'Home Decor',
    price: 299,
    description: 'Colorful cushion cover with traditional embroidery.',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Sambalpuri Saree',
    category: 'Fashion',
    price: 1499,
    description: 'Traditional Sambalpuri saree with unique patterns.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
  }
];

const nameToCategory = {
  'Traditional Jhumka Earrings': 'Jewellery',
  'Block Print Cotton Kurta': 'Fashion',
  'Handwoven Cotton Dupatta': 'Fashion',
  'Sambalpuri Saree': 'Fashion',
  'Handcrafted Terracotta Vase': 'Crafts',
  'Bamboo Craft Basket': 'Crafts',
  'Brass Puja Thali Set': 'Crafts',
  'Macrame Wall Hanging': 'Home Decor',
  'Embroidered Cushion Cover': 'Home Decor',
};

async function addProducts() {
  await mongoose.connect(MONGO_URI);
  // Try to find an artisan to assign as the creator
  const artisan = await User.findOne({ role: 'artisan' });
  for (const prod of sampleProducts) {
    const product = new Product({
      ...prod,
      status: 'active',
      isApproved: true,
      artisan: artisan ? artisan._id : null
    });
    await product.save();
    console.log('Added:', product.name);
  }
  console.log('Sample products added!');
  process.exit(0);
}

async function updateCategories() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  for (const [name, category] of Object.entries(nameToCategory)) {
    const result = await Product.updateMany({ name }, { $set: { category } });
    console.log(`Updated ${result.nModified || result.modifiedCount} product(s) for '${name}' to category '${category}'`);
  }
  await mongoose.disconnect();
  console.log('Done updating categories.');
}

async function updateCategoriesOnly() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  for (const [name, category] of Object.entries(nameToCategory)) {
    const result = await Product.updateMany({ name }, { $set: { category } });
    console.log(`Updated ${result.nModified || result.modifiedCount} product(s) for '${name}' to category '${category}'`);
  }
  await mongoose.disconnect();
  console.log('Done updating categories only.');
}

async function deleteProductByName(productName) {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const result = await Product.deleteMany({ name: productName });
  console.log(`Deleted ${result.deletedCount} product(s) with name '${productName}'`);
  await mongoose.disconnect();
}

async function updateOrdersWithArtisan() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const orders = await Order.find({});
  let updatedCount = 0;
  for (const order of orders) {
    let changed = false;
    const newCart = await Promise.all((order.cart || []).map(async item => {
      if (item.artisan) return item; // already has artisan
      let product = null;
      if (item.id) {
        product = await Product.findById(item.id);
      }
      if (!product && item.name) {
        product = await Product.findOne({ name: item.name });
      }
      if (product && product.artisan) {
        changed = true;
        return { ...item, artisan: product.artisan.toString() };
      }
      return item;
    }));
    if (changed) {
      await Order.updateOne(
        { _id: order._id },
        { $set: { cart: newCart } }
      );
      updatedCount++;
    }
  }
  await mongoose.disconnect();
  console.log(`Updated ${updatedCount} order(s) with artisan info in cart items.`);
}

// Uncomment to run only the delete function

deleteProductByName('sandeepb_21').catch(err => {
  console.error('Error deleting product:', err);
  process.exit(1);
});

// Uncomment to run only the order update
updateOrdersWithArtisan().catch(err => {
  console.error('Error updating orders with artisan:', err);
  process.exit(1);
});

// Comment out all other function calls
// updateCategoriesOnly().catch(err => {
//   console.error('Error updating categories only:', err);
//   process.exit(1);
// });
// updateCategories().catch(err => {
//   console.error('Error updating categories:', err);
//   process.exit(1);
// });
// addProducts().catch(err => {
//   console.error('Error adding sample products:', err);
//   process.exit(1);
// }); 