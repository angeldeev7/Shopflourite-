const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');

// Process payment
router.post('/process', authMiddleware, async (req, res) => {
  try {
    const { orderId, paymentMethod, paymentDetails } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: { message: 'Order not found' } });
    }

    if (order.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    // In a real implementation, integrate with payment gateway (Stripe, PayPal, etc.)
    // This is a simplified version
    
    order.paymentStatus = 'paid';
    order.orderStatus = 'processing';
    await order.save();

    res.json({ 
      message: 'Payment processed successfully', 
      order,
      paymentConfirmation: {
        transactionId: `TXN-${Date.now()}`,
        amount: order.totalAmount,
        status: 'success'
      }
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Verify payment
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { orderId, transactionId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: { message: 'Order not found' } });
    }

    // In a real implementation, verify with payment gateway
    
    res.json({ 
      verified: true,
      order 
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get payment methods
router.get('/methods', async (req, res) => {
  try {
    const methods = [
      { value: 'credit_card', label: 'Credit Card', icon: 'credit-card' },
      { value: 'debit_card', label: 'Debit Card', icon: 'credit-card' },
      { value: 'paypal', label: 'PayPal', icon: 'paypal' },
      { value: 'bank_transfer', label: 'Bank Transfer', icon: 'bank' },
      { value: 'cash_on_delivery', label: 'Cash on Delivery', icon: 'money-bill' }
    ];

    res.json({ methods });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Refund payment (admin only)
router.post('/refund', authMiddleware, async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: { message: 'Order not found' } });
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ error: { message: 'Order is not paid' } });
    }

    // In a real implementation, process refund with payment gateway
    
    order.paymentStatus = 'refunded';
    order.orderStatus = 'cancelled';
    await order.save();

    res.json({ 
      message: 'Refund processed successfully', 
      order 
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
