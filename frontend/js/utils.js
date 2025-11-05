// Utility Functions

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
}

// Format date
function formatDate(date) {
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format datetime
function formatDateTime(date) {
  return new Date(date).toLocaleString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Show loading state
function showLoading(element) {
  if (element) {
    element.innerHTML = '<div class="spinner"></div>';
  }
}

// Hide loading state
function hideLoading() {
  const spinners = document.querySelectorAll('.spinner');
  spinners.forEach(spinner => spinner.remove());
}

// Show alert
function showAlert(message, type = 'success') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} fade-in`;
  alert.textContent = message;
  alert.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 10000;
    min-width: 300px;
  `;
  
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.style.opacity = '0';
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}

// Validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate phone (Mexican format)
function validatePhone(phone) {
  const re = /^(\+52)?[\s-]?\d{10}$/;
  return re.test(phone.replace(/\s/g, ''));
}

// Validate WhatsApp
function validateWhatsApp(whatsapp) {
  return validatePhone(whatsapp);
}

// Validate Telegram username
function validateTelegram(telegram) {
  const re = /^@?[a-zA-Z0-9_]{5,32}$/;
  return re.test(telegram);
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Get query parameter
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Set query parameter
function setQueryParam(param, value) {
  const url = new URL(window.location);
  url.searchParams.set(param, value);
  window.history.pushState({}, '', url);
}

// Scroll to top
function scrollToTop(smooth = true) {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

// Local storage helper
const storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Image error handler
function handleImageError(img, fallback = '/images/products/placeholder.jpg') {
  img.onerror = null;
  img.src = fallback;
}

// Truncate text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

// Generate stars rating HTML
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let html = '';
  
  for (let i = 0; i < fullStars; i++) {
    html += '<span class="star filled">★</span>';
  }
  
  if (hasHalfStar) {
    html += '<span class="star half">★</span>';
  }
  
  for (let i = 0; i < emptyStars; i++) {
    html += '<span class="star">☆</span>';
  }
  
  return html;
}

// Mobile menu toggle
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });

    // Close menu when clicking on a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
}

// Navbar scroll effect
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
}

// Initialize common features
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initNavbarScroll();
});
