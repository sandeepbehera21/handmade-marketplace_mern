const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'packed', 'shipped', 'out for delivery', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  paymentMethod: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  cart: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String },
    image: { type: String },
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  subtotal: { 
    type: Number, 
    required: true 
  },
  shipping: { 
    type: Number, 
    default: 0 
  },
  tax: { 
    type: Number, 
    default: 0 
  },
  total: { 
    type: Number, 
    required: true 
  },
  razorpay_payment_id: { 
    type: String 
  },
  razorpay_order_id: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema); 