const nodemailer = require('nodemailer');
const Order = require('../models/Order');
const User = require('../models/User');
const AdminAction = require('../models/AdminAction');
const Product = require('../models/Product');

// Create a new order and send email
exports.createOrder = async (req, res) => {
  const { email, name, address, phone, postalCode, cart, total, paymentMethod, orderId, subtotal, shipping, tax } = req.body;
  
  console.log('Cart received by backend:', cart);
  
  try {
    // Get user ID from the authenticated user
    const userId = req.user ? req.user._id : null;

    // Enrich cart items with artisan field
    const enrichedCart = await Promise.all(cart.map(async item => {
      // Try to find by _id or name (prefer _id if available)
      let product = null;
      if (item.id) {
        product = await Product.findById(item.id);
      }
      if (!product && item.name) {
        product = await Product.findOne({ name: item.name });
      }
      return {
        ...item,
        artisan: product && product.artisan ? product.artisan.toString() : null
      };
    }));

    // Create order in database
    const newOrder = new Order({
      userId,
      orderId,
      paymentMethod,
      email,
      address: `${address}, ${postalCode}, Phone: ${phone}`,
      cart: enrichedCart,
      subtotal,
      shipping,
      tax,
      total
    });

    const savedOrder = await newOrder.save();
    console.log('Order saved to DB, cart:', savedOrder.cart);

    try {
      // Send confirmation email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });
      
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Order Confirmation - Desi Etsy',
        html: `<h2>Thank you for your order, ${name}!</h2>
          <p>Your order has been received and is being processed.</p>
          <p><b>Order ID:</b> ${orderId}</p>
          <p><b>Shipping Address:</b> ${address}, ${postalCode}, Phone: ${phone}</p>
          <p><b>Order Total:</b> ₹${total}</p>
          <p><b>Payment Method:</b> ${paymentMethod}</p>
          <hr/>
          <h3>Order Details:</h3>
          <ul>${cart.map(item => `<li>${item.name} x${item.quantity} - ₹${item.price}</li>`).join('')}</ul>
          <p>We will notify you when your order ships!</p>`
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (emailError) {
      console.error("Could not send email. This is not critical.", emailError);
    }
    
    res.json({ success: true, message: 'Order placed and email sent.', order: savedOrder });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, message: 'Order failed', error: err.message });
  }
};

// Get all orders for a specific user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get all orders (for admin/artisan)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Log admin action
    if (req.user && req.user.role === 'admin') {
      await AdminAction.create({
        adminId: req.user._id,
        action: `update order status to ${status}`,
        targetType: 'order',
        targetId: orderId
      });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).populate('userId', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
}; 