import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../utils/CartContext';
import { useAuth } from '../utils/AuthContext';
import ReviewCard from '../components/ReviewCard';
import { FaStar } from 'react-icons/fa';
import api from '../services/api';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/product/${id}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert('Product added to cart!');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }

    try {
      await api.post('/reviews', {
        productId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
      alert('Review submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Error submitting review');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? 'star filled' : 'star'}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-main">
          <div className="product-images">
            <div className="main-image">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[selectedImage]} alt={product.name} />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-details">
            <h1>{product.name}</h1>
            
            <div className="product-rating">
              {renderStars(Math.round(product.rating || 0))}
              <span className="rating-text">
                {product.rating?.toFixed(1) || '0.0'} ({product.reviewCount || 0} reviews)
              </span>
            </div>

            <div className="product-price">
              <span className="current-price">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                  <span className="discount">
                    Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            <div className="product-meta">
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock}
                />
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        <div className="product-reviews">
          <h2>Customer Reviews</h2>

          {isAuthenticated && (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <h3>Write a Review</h3>
              
              <div className="rating-input">
                <label>Rating:</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <textarea
                placeholder="Write your review..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                required
              />

              <button type="submit" className="submit-review-btn">Submit Review</button>
            </form>
          )}

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map(review => (
                <ReviewCard key={review._id} review={review} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
