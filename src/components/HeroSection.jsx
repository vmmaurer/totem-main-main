import React, { useState } from 'react';
import { products } from '../data/products';
import ArcCarousel from './ArcCarousel';
import ProductModal from './ProductModal';
import './HeroSection.css';

const HeroSection = () => {
  const [activeProduct, setActiveProduct] = useState(null);

  return (
    <section className="hero-section">
      <div className="grid-overlay" />
      <div className="hero-content">
        <img className="hero-logo" src="/images/logonavbar.png" alt="Logo" />
      </div>
      <div className="carousel-wrapper">
        <ArcCarousel items={products} onCardTap={setActiveProduct} />
      </div>
      {activeProduct && (
        <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
      )}
    </section>
  );
};

export default HeroSection;