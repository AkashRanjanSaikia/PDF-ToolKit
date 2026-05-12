import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Contact Us</a>
      </div>
      <p>&copy; {new Date().getFullYear()} PDF-Kit. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
