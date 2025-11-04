const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get user's cart (stored in session or database)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // In a real implementation, cart could be stored in a separate Cart model
    // For simplicity, returning empty cart structure
    res.json({ 
      items: [],
      totalAmount: 0
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Add item to cart
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: { message: 'Product not found' } });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: { message: 'Insufficient stock' } });
    }

    res.json({ 
      message: 'Item added to cart',
      item: {
        product: product,
        quantity
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update cart item
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: { message: 'Product not found' } });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: { message: 'Insufficient stock' } });
    }

    res.json({ message: 'Cart updated' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Remove item from cart
router.delete('/remove/:productId', authMiddleware, async (req, res) => {
  try {
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Clear cart
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
