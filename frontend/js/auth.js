// Authentication Management
class Auth {
  constructor() {
    this.user = this.loadUser();
  }

  loadUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  saveUser(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser() {
    this.user = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  isAuthenticated() {
    return !!this.user && !!localStorage.getItem('token');
  }

  getUser() {
    return this.user;
  }

  async login(email, password) {
    try {
      const data = await api.login(email, password);
      this.saveUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async register(userData) {
    try {
      const data = await api.register(userData);
      this.saveUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    this.clearUser();
    cart.clear();
    api.logout();
  }

  async checkAuth() {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      const data = await api.getProfile();
      this.saveUser(data.user);
      return true;
    } catch (error) {
      this.clearUser();
      return false;
    }
  }

  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return false;
    }
    return true;
  }

  updateUserUI() {
    const userMenus = document.querySelectorAll('.user-menu');
    const guestMenus = document.querySelectorAll('.guest-menu');
    const userNames = document.querySelectorAll('.user-name');

    if (this.isAuthenticated()) {
      userMenus.forEach(menu => menu.style.display = 'block');
      guestMenus.forEach(menu => menu.style.display = 'none');
      userNames.forEach(name => name.textContent = this.user.name);
    } else {
      userMenus.forEach(menu => menu.style.display = 'none');
      guestMenus.forEach(menu => menu.style.display = 'block');
    }
  }
}

// Export singleton instance
const auth = new Auth();

// Initialize user UI on page load
document.addEventListener('DOMContentLoaded', () => {
  auth.updateUserUI();
});
