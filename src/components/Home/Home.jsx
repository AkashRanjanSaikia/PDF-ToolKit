import React from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import './Home.css';

const Home = () => {
  return (
    <div className="homepage-container">
      <Hero />
      <Features />
    </div>
  );
};

export default Home;
