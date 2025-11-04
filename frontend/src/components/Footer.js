import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ShopFlourite</h3>
            <p>Your trusted online shopping destination</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/catalog">Products</Link></li>
              <li><Link to="/support">Support</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p><FaEnvelope /> support@shopflourite.com</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ShopFlourite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
