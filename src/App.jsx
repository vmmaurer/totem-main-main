import React, { useState, useEffect, useRef } from 'react';
import HeroSection from './components/HeroSection';
import CTASection from './components/CTASection';
import EstruturaSection from './components/EstruturaSection';
import HistoriaSection from './components/HistoriaSection';
import BottomNav from './components/BottomNav';

const SCREENS = ['produtos', 'estrutura', 'historia', 'contato'];

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('produtos');
  const idleTimer = useRef(null);

  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setCurrentScreen('produtos'), 30000);
  };

  useEffect(() => {
    window.addEventListener('mousedown', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);
    resetIdleTimer();
    return () => {
      window.removeEventListener('mousedown', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  const currentIndex = SCREENS.indexOf(currentScreen);

  const screenMap = {
    produtos:  <HeroSection />,
    estrutura: <EstruturaSection />,
    historia:  <HistoriaSection />,
    contato:   <CTASection />,
  };

  return (
    <div
      style={{
        width: '100vw', height: '100vh',
        overflow: 'hidden', display: 'flex',
        flexDirection: 'column', backgroundColor: '#000'
      }}
    >
      <div style={{
        flex: 1,
        display: 'flex',
        transition: 'transform 0.5s ease-in-out',
        transform: `translateX(-${currentIndex * 100}vw)`,
        width: `${SCREENS.length * 100}vw`
      }}>
        {SCREENS.map((screen) => (
          <div key={screen} style={{ width: '100vw', height: '100%', overflowY: 'auto' }}>
            {screenMap[screen]}
          </div>
        ))}
      </div>

      <BottomNav
        currentScreen={currentScreen}
        onScreenChange={(screen) => { setCurrentScreen(screen); resetIdleTimer(); }}
      />
    </div>
  );
};

export default App;