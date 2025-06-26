const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'your-mongodb-uri-here';

mongoose.connect(uri)
  .then(() => {
    console.log('Connected!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  }); 