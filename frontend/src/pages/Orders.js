import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import api from '../services/api';
import '../styles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return statusClasses[status] || '';
  };

  const getPaymentStatusClass = (status) => {
    const statusClasses = {
      pending: 'payment-pending',
      paid: 'payment-paid',
      failed: 'payment-failed',
      refunded: 'payment-refunded'
    };
    return statusClasses[status] || '';
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders">
      <div className="container">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <Link to="/catalog" className="shop-link">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.substring(0, 8)}</h3>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <span className={`payment-badge ${getPaymentStatusClass(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">{item.product?.name || 'Product'}</span>
                      <span className="item-qty">x{item.quantity}</span>
                      <span className="item-price">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total:</strong>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <Link to={`/order/${order._id}`} className="view-details-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
