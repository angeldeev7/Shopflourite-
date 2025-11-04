import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import api from '../services/api';
import '../styles/OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingProof, setUploadingProof] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrder();
  }, [id, isAuthenticated, navigate]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Order not found');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProof = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingProof(true);

    try {
      const formData = new FormData();
      formData.append('proof', file);

      await api.post(`/orders/${id}/payment-proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Payment proof uploaded successfully!');
      fetchOrder();
    } catch (error) {
      alert('Error uploading payment proof');
    } finally {
      setUploadingProof(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await api.put(`/orders/${id}/cancel`);
      alert('Order cancelled successfully');
      fetchOrder();
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Error cancelling order');
    }
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return <div className="error">Order not found</div>;
  }

  return (
    <div className="order-detail">
      <div className="container">
        <h1>Order Details</h1>

        <div className="order-info-grid">
          <div className="info-card">
            <h3>Order Information</h3>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> <span className={`status ${order.orderStatus}`}>{order.orderStatus}</span></p>
            <p><strong>Payment Status:</strong> <span className={`status ${order.paymentStatus}`}>{order.paymentStatus}</span></p>
            <p><strong>Payment Method:</strong> {order.paymentMethod.replace('_', ' ')}</p>
            {order.trackingNumber && (
              <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
            )}
          </div>

          <div className="info-card">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
          </div>
        </div>

        <div className="order-items-section">
          <h3>Order Items</h3>
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={index} className="item-row">
                <div className="item-details">
                  {item.product?.images && item.product.images.length > 0 && (
                    <img src={item.product.images[0]} alt={item.product?.name} className="item-image" />
                  )}
                  <div>
                    <h4>{item.product?.name || 'Product'}</h4>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-total">
            <strong>Total Amount:</strong>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {order.notes && (
          <div className="order-notes">
            <h3>Order Notes</h3>
            <p>{order.notes}</p>
          </div>
        )}

        {order.paymentMethod === 'bank_transfer' && order.paymentStatus === 'pending' && (
          <div className="payment-proof-section">
            <h3>Upload Payment Proof</h3>
            <p>Please upload a screenshot or photo of your payment receipt</p>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleUploadProof}
              disabled={uploadingProof}
            />
            {uploadingProof && <p>Uploading...</p>}
          </div>
        )}

        {order.paymentProof && (
          <div className="payment-proof-display">
            <h3>Payment Proof</h3>
            <a href={order.paymentProof} target="_blank" rel="noopener noreferrer">
              View Payment Proof
            </a>
          </div>
        )}

        <div className="order-actions">
          {(order.orderStatus === 'pending' || order.orderStatus === 'processing') && (
            <button className="cancel-btn" onClick={handleCancelOrder}>
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
