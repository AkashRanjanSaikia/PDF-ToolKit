import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="navbar">
      <Link to="/" className="logo-link">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="logo"
        >
          PDF<span>kit</span>
        </motion.div>
      </Link>
    </header>
  );
};

export default Navbar;
