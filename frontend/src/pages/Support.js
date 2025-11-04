import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import api from '../services/api';
import '../styles/Support.css';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    subject: '',
    category: 'other',
    priority: 'medium',
    message: ''
  });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchTickets();
  }, [isAuthenticated, navigate]);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/support/my-tickets');
      setTickets(response.data.tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/support', formData);
      alert('Support ticket created successfully!');
      setFormData({
        subject: '',
        category: 'other',
        priority: 'medium',
        message: ''
      });
      setShowNewTicket(false);
      fetchTickets();
    } catch (error) {
      alert('Error creating support ticket');
    }
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      open: 'status-open',
      in_progress: 'status-progress',
      resolved: 'status-resolved',
      closed: 'status-closed'
    };
    return statusClasses[status] || '';
  };

  if (!isAuthenticated) {
    return (
      <div className="support">
        <div className="container">
          <h1>Support</h1>
          <p>Please <a href="/login">login</a> to access support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="support">
      <div className="container">
        <h1>Support Center</h1>

        <button
          className="new-ticket-btn"
          onClick={() => setShowNewTicket(!showNewTicket)}
        >
          {showNewTicket ? 'Cancel' : 'Create New Ticket'}
        </button>

        {showNewTicket && (
          <div className="ticket-form-card">
            <h2>Create Support Ticket</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="order">Order Issue</option>
                    <option value="product">Product Question</option>
                    <option value="payment">Payment Issue</option>
                    <option value="technical">Technical Problem</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="6"
                  required
                  placeholder="Describe your issue in detail..."
                />
              </div>

              <button type="submit" className="submit-btn">
                Submit Ticket
              </button>
            </form>
          </div>
        )}

        <div className="tickets-section">
          <h2>My Support Tickets</h2>

          {loading ? (
            <div className="loading">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="no-tickets">
              <p>You don't have any support tickets yet.</p>
            </div>
          ) : (
            <div className="tickets-list">
              {tickets.map(ticket => (
                <div key={ticket._id} className="ticket-card">
                  <div className="ticket-header">
                    <h3>{ticket.subject}</h3>
                    <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="ticket-meta">
                    <span className="ticket-category">
                      Category: {ticket.category}
                    </span>
                    <span className="ticket-priority">
                      Priority: {ticket.priority}
                    </span>
                    <span className="ticket-date">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="ticket-preview">
                    {ticket.messages && ticket.messages.length > 0 && (
                      <p>{ticket.messages[0].message}</p>
                    )}
                  </div>

                  <div className="ticket-stats">
                    <span>{ticket.messages?.length || 0} messages</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
