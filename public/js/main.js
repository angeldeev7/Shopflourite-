// ShopFlourite - Main JavaScript

// API Configuration
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : '/api';

// Hamburger Menu
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav ul');
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }

  // Check authentication status
  checkAuth();
  
  // Update cart badge
  updateCartBadge();
});

// Authentication Functions
function checkAuth() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const authLinks = document.getElementById('auth-links');
  const userLinks = document.getElementById('user-links');
  
  if (token && user.name) {
    if (authLinks) authLinks.style.display = 'none';
    if (userLinks) {
      userLinks.style.display = 'flex';
      const userName = userLinks.querySelector('.user-name');
      if (userName) userName.textContent = user.name;
    }
  } else {
    if (authLinks) authLinks.style.display = 'flex';
    if (userLinks) userLinks.style.display = 'none';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/index.html';
}

// Cart Functions
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  saveCart(cart);
  showAlert('Producto agregado al carrito', 'success');
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
}

function clearCart() {
  localStorage.removeItem('cart');
  updateCartBadge();
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en la solicitud');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Alert/Notification System
function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} fade-in`;
  alertDiv.textContent = message;
  
  // Create alerts container if it doesn't exist
  let alertsContainer = document.getElementById('alerts-container');
  if (!alertsContainer) {
    alertsContainer = document.createElement('div');
    alertsContainer.id = 'alerts-container';
    alertsContainer.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 9999; max-width: 400px;';
    document.body.appendChild(alertsContainer);
  }
  
  alertsContainer.appendChild(alertDiv);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    alertDiv.style.opacity = '0';
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}

// Loading Spinner
function showLoading(element) {
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  spinner.id = 'loading-spinner';
  
  if (element) {
    element.appendChild(spinner);
  } else {
    document.body.appendChild(spinner);
  }
}

function hideLoading() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) {
    spinner.remove();
  }
}

// Format Currency
function formatPrice(price) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

// Format Date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Validate Email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate Phone
function isValidPhone(phone) {
  const re = /^\+?[\d\s\-()]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 9;
}

// Form Validation Helper
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = 'var(--error)';
      isValid = false;
    } else {
      input.style.borderColor = 'var(--glass-border)';
    }
  });
  
  return isValid;
}

// Smooth Scroll
function smoothScroll(targetId) {
  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// Local Storage Helper
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

function getFromStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

// WhatsApp Login Helper
function getWhatsAppPhone() {
  const phone = localStorage.getItem('whatsapp_phone');
  return phone || null;
}

function saveWhatsAppPhone(phone) {
  localStorage.setItem('whatsapp_phone', phone);
}

// Initialize tooltips and other UI enhancements
function initializeUI() {
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      this.appendChild(ripple);
      
      const x = e.clientX - e.target.offsetLeft;
      const y = e.clientY - e.target.offsetTop;
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Call UI initialization
document.addEventListener('DOMContentLoaded', initializeUI);

// Export functions for use in other scripts
window.ShopFlourite = {
  checkAuth,
  logout,
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  getCartTotal,
  getCartCount,
  updateCartBadge,
  apiRequest,
  showAlert,
  showLoading,
  hideLoading,
  formatPrice,
  formatDate,
  isValidEmail,
  isValidPhone,
  validateForm,
  smoothScroll,
  saveToStorage,
  getFromStorage,
  getWhatsAppPhone,
  saveWhatsAppPhone
};
