import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../utils/CartContext';
import { useAuth } from '../utils/AuthContext';
import api from '../services/api';
import '../styles/Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
    phone: user?.phone || '',
    paymentMethod: 'credit_card',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Please login to complete your order');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      navigate('/cart');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      const response = await api.post('/orders', orderData);
      
      clearCart();
      alert('Order placed successfully!');
      navigate(`/order/${response.data.order._id}`);
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="checkout">
        <div className="container">
          <h1>Checkout</h1>
          <p>Please <a href="/login">login</a> to continue with checkout.</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout">
        <div className="container">
          <h1>Checkout</h1>
          <p>Your cart is empty. <a href="/catalog">Continue shopping</a></p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-content">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Shipping Address</h2>

              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Zip Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Payment Method</h2>

              <div className="form-group">
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash_on_delivery">Cash on Delivery</option>
                </select>
              </div>

              {(formData.paymentMethod === 'bank_transfer') && (
                <div className="payment-info">
                  <p><strong>Bank Transfer Information:</strong></p>
                  <p>After placing your order, you'll receive bank details to complete the payment.</p>
                  <p>Please upload proof of payment on the order details page.</p>
                </div>
              )}
            </div>

            <div className="form-section">
              <h2>Order Notes (Optional)</h2>

              <div className="form-group">
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for your order..."
                  rows="4"
                />
              </div>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>

          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.product._id} className="summary-item">
                  <div className="item-info">
                    <span className="item-name">{item.product.name}</span>
                    <span className="item-qty">x{item.quantity}</span>
                  </div>
                  <span className="item-price">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>

              <div className="summary-row total">
                <strong>Total:</strong>
                <strong>${getCartTotal().toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
