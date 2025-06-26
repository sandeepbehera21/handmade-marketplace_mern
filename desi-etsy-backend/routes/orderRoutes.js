const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a new order
router.post('/create', auth, orderController.createOrder);

// Get all orders for the authenticated user
router.get('/user-orders', auth, orderController.getUserOrders);

// Get all orders (for admin/artisan)
router.get('/all', auth, orderController.getAllOrders);

// Update order status
router.put('/:orderId/status', auth, orderController.updateOrderStatus);

// Get order by ID
router.get('/:orderId', auth, orderController.getOrderById);

router.post('/create-razorpay-order', async (req, res) => {
  const { amount, currency = 'INR', receipt, cart, email, name, address, phone, postalCode, subtotal, shipping, tax, userId } = req.body;
  try {
    // Ensure amount is a number and an integer (in paise)
    const amountInPaise = Math.round(Number(amount) * 100);
    const options = {
      amount: amountInPaise, // amount in paise, must be integer
      currency,
      receipt: receipt || `rcptid_${Date.now()}`
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // Save a pending order in MongoDB
    const newOrder = new Order({
      userId,
      orderId: receipt || `ORD${Date.now()}`,
      paymentMethod: 'Razorpay',
      email,
      address: address ? address : '',
      cart: cart || [],
      subtotal: subtotal || 0,
      shipping: shipping || 0,
      tax: tax || 0,
      total: amountInPaise / 100, // store total in rupees
      razorpay_order_id: razorpayOrder.id,
      paymentStatus: 'pending'
    });
    await newOrder.save();

    res.json(razorpayOrder);
  } catch (err) {
    console.error('Razorpay order creation error:', err); // Log full error
    res.status(500).json({ error: err.message });
  }
});

router.post('/mark-paid', async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;
  try {
    // Log the payment details
    console.log('Razorpay payment received:', {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId
    });

    // Update the order in DB by razorpay_order_id
    const updatedOrder = await Order.findOneAndUpdate(
      { razorpay_order_id: razorpay_order_id },
      { paymentStatus: 'paid', razorpay_payment_id },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found for this Razorpay order ID' });
    }

    res.json({ success: true, message: 'Order marked as paid', order: updatedOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 