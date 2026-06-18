import React from 'react';
import LinhaDoTempo from './LinhaDoTempo';
import './HeroSection.css';

const HistoriaSection = () => {
  return (
    <section
      className="hero-section"
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflowY: 'auto',
        minHeight: '100vh',
        padding: 0,
        background: 'linear-gradient(180deg, #040b19 0%, #405b7a 50%, #040b19 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div className="grid-overlay" />

      {/* Fades laterais — cobrem do topo ao fim REAL do conteúdo,
          independente do zoom, porque ficam no container externo
          que cresce junto com tudo (não no container interno
          que tinha altura calculada via flex aninhado) */}
      {[['left', '90deg'], ['right', '270deg']].map(([side, deg]) => (
        <div
          key={side}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            [side]: 0,
            width: 80,
            background: `linear-gradient(${deg}, rgba(4,11,25,0.9) 0%, transparent 100%)`,
            pointerEvents: 'none',
            zIndex: 20,
          }}
        />
      ))}

      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}>
        <LinhaDoTempo />
      </div>
    </section>
  );
};

export default HistoriaSection;