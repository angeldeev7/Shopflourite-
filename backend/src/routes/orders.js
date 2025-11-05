const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');
const telegramService = require('../services/telegram');

// Create order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: { message: 'Cart is empty' } });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ error: { message: `Product ${item.productId} not found` } });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: { message: `Insufficient stock for ${product.name}` } });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

      totalAmount += product.price * item.quantity;

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      notes
    });

    await order.save();

    await order.populate('items.product user');

    // Send Telegram notification
    try {
      await telegramService.notifyNewOrder(order);
    } catch (error) {
      console.error('Telegram notification error:', error);
    }

    res.status(201).json({ 
      message: 'Order created successfully', 
      order 
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get user's orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Order.countDocuments({ user: req.userId });

    res.json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalOrders: count
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get all orders (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;

    const query = {};
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('user items.product')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalOrders: count
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get single order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user items.product');

    if (!order) {
      return res.status(404).json({ error: { message: 'Order not found' } });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update order status (admin only)
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, trackingNumber },
      { new: true }
    ).populate('user items.product');

    if (!order) {
      return res.status(404).json({ error: { message: 'Order not found' } });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Upload payment proof
router.post('/:id/payment-proof', authMiddleware, upload.single('proof'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: { message: 'Order not found' } });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    if (!req.file) {
      return res.status(400).json({ error: { message: 'No file uploaded' } });
    }

    order.paymentProof = `/uploads/${req.file.filename}`;
    order.paymentStatus = 'pending';
    await order.save();

    res.json({ message: 'Payment proof uploaded successfully', order });
  } catch (error) {
    console.error('Upload payment proof error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update payment status (admin only)
router.put('/:id/payment-status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    ).populate('user items.product');

    if (!order) {
      return res.status(404).json({ error: { message: 'Order not found' } });
    }

    res.json({ message: 'Payment status updated', order });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Cancel order
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: { message: 'Order not found' } });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
      return res.status(400).json({ error: { message: 'Cannot cancel shipped or delivered orders' } });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
