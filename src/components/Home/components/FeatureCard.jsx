import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div 
      className="feature-card-wrapper"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={feature.path} className="feature-card">
        <div className="feature-icon-wrapper" style={{ color: feature.color, background: `${feature.color}15` }}>
          {feature.icon}
        </div>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
        <div className="feature-btn">
          Open Tool <ChevronRight size={16} />
        </div>
      </Link>
    </motion.div>
  );
};

export default FeatureCard;
