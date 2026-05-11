import React from 'react';
import { FEATURES } from '../../../constants';
import FeatureCard from './FeatureCard';

const Features = () => {
  return (
    <section id="features" className="features-container">
      <div className="section-header">
        <h2>Everything you need for PDFs</h2>
        <p>Most popular tools to help you get work done faster.</p>
      </div>
      <div className="features-grid">
        {FEATURES.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Features;
