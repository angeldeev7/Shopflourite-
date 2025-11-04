const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Review.countDocuments({ product: req.params.productId });

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalReviews: count
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Create review
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ error: { message: 'Missing required fields' } });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: { message: 'Rating must be between 1 and 5' } });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: { message: 'Product not found' } });
    }

    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      user: req.userId,
      'items.product': productId,
      orderStatus: 'delivered'
    });

    const existingReview = await Review.findOne({
      product: productId,
      user: req.userId
    });

    if (existingReview) {
      return res.status(400).json({ error: { message: 'You have already reviewed this product' } });
    }

    const review = new Review({
      product: productId,
      user: req.userId,
      rating,
      comment,
      isVerified: !!hasPurchased
    });

    await review.save();

    // Update product rating
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    product.rating = avgRating;
    product.reviewCount = allReviews.length;
    await product.save();

    await review.populate('user', 'name avatar');

    res.status(201).json({ 
      message: 'Review created successfully', 
      review 
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update review
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: { message: 'Review not found' } });
    }

    if (review.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    // Update product rating
    const allReviews = await Review.find({ product: review.product });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await Product.findByIdAndUpdate(review.product, { rating: avgRating });

    await review.populate('user', 'name avatar');

    res.json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Delete review
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: { message: 'Review not found' } });
    }

    if (review.user.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    const productId = review.product;
    await review.deleteOne();

    // Update product rating
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.length > 0 
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length 
      : 0;
    
    await Product.findByIdAndUpdate(productId, { 
      rating: avgRating,
      reviewCount: allReviews.length
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Mark review as helpful
router.post('/:id/helpful', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    ).populate('user', 'name avatar');

    if (!review) {
      return res.status(404).json({ error: { message: 'Review not found' } });
    }

    res.json({ message: 'Review marked as helpful', review });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
