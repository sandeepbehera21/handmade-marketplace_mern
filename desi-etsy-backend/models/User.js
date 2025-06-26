const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "artisan", "admin"], required: true },
  shopName: { type: String }, // Only for artisans
  isVerified: { type: Boolean, default: false }, // For artisan verification
  // Profile fields
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String, enum: ["male", "female", "other"] },
  mobile: { type: String },
  addresses: [addressSchema],
  profileImage: { type: String }, // Path or URL to profile picture
  location: { type: String },
  craftType: { type: String },
  bio: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
