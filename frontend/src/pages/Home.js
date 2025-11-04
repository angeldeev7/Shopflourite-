import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../utils/CartContext';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import '../styles/Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/products?featured=true&limit=8');
      setFeaturedProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert('Product added to cart!');
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to ShopFlourite</h1>
            <p>Discover amazing products at unbeatable prices</p>
            <Link to="/catalog" className="cta-button">Shop Now</Link>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          <div className="view-all">
            <Link to="/catalog" className="view-all-link">View All Products</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <h3>🚚 Free Shipping</h3>
              <p>On orders over $50</p>
            </div>
            <div className="feature">
              <h3>💳 Secure Payment</h3>
              <p>100% secure transactions</p>
            </div>
            <div className="feature">
              <h3>↩️ Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
            <div className="feature">
              <h3>24/7 Support</h3>
              <p>Dedicated customer service</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
