import React from 'react';
import LinhaDoTempo from './LinhaDoTempo';
import './HeroSection.css';

const HistoriaSection = () => {
  return (
    <section
      className="hero-section"
      style={{
        justifyContent: 'center',
        overflowY: 'auto',
        minHeight: '100vh',
        padding: 0,
        background: 'linear-gradient(180deg, #040b19 0%, #405b7a 50%, #040b19 100%)',
      }}
    >
      <div className="grid-overlay" />
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}>
        <LinhaDoTempo />
      </div>
    </section>
  );
};

export default HistoriaSection;