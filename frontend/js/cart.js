// Shopping Cart Management
class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
    this.updateCartUI();
  }

  loadCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.updateCartUI();
  }

  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product._id || item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.images && product.images[0] || '/images/products/placeholder.jpg',
        quantity: quantity
      });
    }
    
    this.saveCart();
    this.showNotification('Producto agregado al carrito');
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.showNotification('Producto eliminado del carrito', 'info');
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  clear() {
    this.items = [];
    this.saveCart();
  }

  updateCartUI() {
    const cartBadges = document.querySelectorAll('.cart-badge');
    const count = this.getItemCount();
    
    cartBadges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Export singleton instance
const cart = new ShoppingCart();
