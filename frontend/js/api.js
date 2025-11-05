// API Configuration
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : '/api';

class API {
  constructor() {
    this.baseURL = API_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  async updateProfile(userData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  }

  // Products endpoints
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products${queryString ? '?' + queryString : ''}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  // Orders endpoints
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getMyOrders() {
    return this.request('/orders/my-orders');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async uploadPaymentProof(orderId, file) {
    const formData = new FormData();
    formData.append('paymentProof', file);

    return fetch(`${this.baseURL}/orders/${orderId}/payment-proof`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: formData
    }).then(res => res.json());
  }

  // Reviews endpoints
  async getProductReviews(productId) {
    return this.request(`/reviews/product/${productId}`);
  }

  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  // Support endpoints
  async createTicket(ticketData) {
    return this.request('/support', {
      method: 'POST',
      body: JSON.stringify(ticketData)
    });
  }

  async getMyTickets() {
    return this.request('/support/my-tickets');
  }

  async getTicket(id) {
    return this.request(`/support/${id}`);
  }

  async addTicketMessage(id, message) {
    return this.request(`/support/${id}/message`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }
}

// Export singleton instance
const api = new API();
