const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sandeep:sand345@cluster22d.z76gsju.mongodb.net/test?retryWrites=true&w=majority';

async function listUsers() {
  await mongoose.connect(MONGO_URI);
  const users = await User.find({}, { email: 1, role: 1, _id: 1 });
  console.log('Users in database:', users);
  process.exit(0);
}

listUsers().catch(err => {
  console.error('Error listing users:', err);
  process.exit(1);
}); 