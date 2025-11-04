import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useCart } from '../utils/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import '../styles/Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>ShopFlourite</h1>
          </Link>

          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/catalog" className="nav-link">Catalog</Link>
            <Link to="/support" className="nav-link">Support</Link>
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="cart-icon">
              <FaShoppingCart />
              {getCartCount() > 0 && (
                <span className="cart-badge">{getCartCount()}</span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/profile" className="user-link">
                  <FaUser /> {user?.name}
                </Link>
                <button onClick={logout} className="logout-btn">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-link">
                <FaSignInAlt /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
