const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // You need a User schema

// Use environment variable or fallback to a default secret
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production";

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, shopName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      shopName: role === "artisan" ? shopName : undefined
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, userId: newUser._id, email: newUser.email, role: newUser.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.role === 'artisan' && !user.isVerified) {
      return res.status(403).json({ message: 'Your account is pending admin approval. Please wait for verification.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, userId: user._id, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
