const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sandeep:sand345@cluster22d.z76gsju.mongodb.net/test?retryWrites=true&w=majority';

async function createAdmin() {
  await mongoose.connect(MONGO_URI);

  const name = 'Admin User';
  const email = 'sandeep2@gmail.com';
  const password = '123456'; // Change as needed
  const role = 'admin';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new User({
    name,
    email,
    password: hashedPassword,
    role,
    isVerified: true
  });
  await admin.save();
  console.log('Admin user created:', { email, password });
  process.exit(0);
}

createAdmin().catch(err => {
  console.error('Error creating admin:', err);
  process.exit(1);
}); 