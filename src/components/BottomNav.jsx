import React, { useRef, useState } from 'react';
import styled from 'styled-components';

/* ----------------------------------------------------------------
   Liquid glass bottom nav — versão estável, escala 1.5x.

   Por que o feDisplacementMap saiu:
   - O mapa de deslocamento original foi feito para outra proporção
     de elemento e, numa pílula larga e fina, distorcia de forma
     desigual o conteúdo atrás (texto/fotos com contraste viravam
     "manchas").
   - Safari/WebKit não suporta url(#filtro) dentro de backdrop-filter,
     então o efeito nunca aparecia de forma consistente entre
     navegadores — só causava risco, sem ganho real.

   O efeito "vidro líquido" aqui vem de:
   - backdrop-filter (blur + saturate + brightness) — sempre estável,
     reage ao fundo real sem depender de uma textura fixa.
   - duas camadas de gradiente (sheen no topo + brilho de borda) que
     simulam a luz "pegando" no vidro, sem distorcer nada.
   - o "blob" ativo com spring (cubic-bezier com overshoot) pra dar
     a sensação de elástico/líquido ao snapar na aba.

   Cor de seleção: controlada só por $active (JS), nunca por :hover —
   ver TabButton para o porquê (pointer capture + drag bugavam o hover).
------------------------------------------------------------------ */

const Nav = styled.nav`
  --c-glass: #bbbbbc;
  --c-light: #fff;
  --c-dark: #000;
  --c-content: #f5f5f7;
  --c-action: #03d5ff;
  --glass-reflex-dark: 2;
  --glass-reflex-light: 0.3;
  --saturation: 180%;

  position: fixed;
  bottom: clamp(36px, 4vh, 72px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  box-sizing: border-box;
  width: min(92vw, 600px);
  padding: 15px 18px;
  border-radius: 99em;
  isolation: isolate;

  background-color: color-mix(in srgb, var(--c-glass) 16%, transparent);
  backdrop-filter: blur(27px) saturate(var(--saturation)) brightness(1.05);
  -webkit-backdrop-filter: blur(27px) saturate(var(--saturation)) brightness(1.05);

  box-shadow:
    inset 0 0 0 1.5px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 10%), transparent),
    inset 2.7px 4.5px 0px -3px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 90%), transparent),
    inset -3px -3px 0px -3px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 80%), transparent),
    inset -4.5px -12px 1.5px -9px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 60%), transparent),
    inset -0.45px -1.5px 6px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 12%), transparent),
    inset -2.25px 3.75px 0px -3px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 20%), transparent),
    inset 0px 4.5px 6px -3px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 20%), transparent),
    inset 3px -9.75px 1.5px -6px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
    0px 1.5px 7.5px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
    0px 9px 24px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 8%), transparent);

  /* sheen no topo — simula a luz passando pelo vidro, sem distorcer nada */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--c-light) 35%, transparent) 0%,
      transparent 45%
    );
    mix-blend-mode: overlay;
    pointer-events: none;
  }
`;

const Track = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  touch-action: none; /* essencial em totem touch: impede scroll/zoom nativo ao arrastar */
  -webkit-user-select: none;
  user-select: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Highlight = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: calc(100% / ${({ $count }) => $count});
  border-radius: 99em;
  pointer-events: none;

  background-color: color-mix(in srgb, var(--c-glass) 36%, transparent);
  box-shadow:
    inset 0 0 0 1.5px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 10%), transparent),
    inset 3px 1.5px 0px -1.5px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 90%), transparent),
    inset -2.25px -1.5px 0px -1.5px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 80%), transparent),
    inset -3px -9px 1.5px -7.5px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 60%), transparent),
    inset -1.5px 3px 4.5px -1.5px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 20%), transparent),
    inset 0px -6px 1.5px -3px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
    0px 4.5px 9px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 8%), transparent);

  will-change: left, scale;
  scale: ${({ $dragging }) => ($dragging ? '1.04' : '1')};
  transition: ${({ $dragging }) =>
    $dragging
      ? 'scale 140ms ease'
      : 'left 520ms cubic-bezier(0.34, 1.56, 0.64, 1), scale 220ms ease'};

  @media (prefers-reduced-motion: reduce) {
    transition: ${({ $dragging }) => ($dragging ? 'none' : 'left 1ms linear')};
  }
`;

const TabButton = styled.button`
  position: relative;
  z-index: 1;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 90px;
  padding: 15px 9px;
  border: none;
  border-radius: 99em;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: none;

  color: ${({ $active }) => ($active ? 'var(--c-action)' : 'var(--c-content)')};
  transition: color 200ms ease;

  /* :hover de cor removido de propósito: com setPointerCapture ativo
     no Track (necessário pro drag), o navegador calcula :hover com
     base no elemento que capturou o ponteiro, não no que está sob o
     cursor/dedo — isso fazia o botão onde o arraste começou ficar
     "preso" em azul (acontece até em touch, pois muitos totens
     reportam hover:hover mesmo sem mouse). A cor de seleção real
     vem só da prop $active acima. */
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      cursor: pointer;
    }
  }

  &:active {
    scale: 0.95;
  }

  &:focus-visible {
    outline: 3px solid var(--c-content);
    outline-offset: 4.5px;
  }

  svg {
    width: 39px;
    height: 39px;
    fill: currentColor;
    transition: scale 200ms cubic-bezier(0.5, 0, 0, 1);
  }

  span {
    font-size: 16.5px;
    font-weight: 600;
    letter-spacing: 0.01em;
    line-height: 1;
    white-space: nowrap;
  }
`;

/* ----------------------------------------------------------------
   Tabs + icons matching each page's purpose
------------------------------------------------------------------ */
const tabs = [
  { id: 'produtos', label: 'Produtos', icon: 'grid' },
  { id: 'estrutura', label: 'Estrutura', icon: 'layers' },
  { id: 'historia', label: 'História', icon: 'history' },
  { id: 'contato', label: 'Contato', icon: 'call' },
];

const icons = {
  grid: (
    <svg viewBox="0 0 24 24">
      <path d="M6 6h4v4H6V6zm0 6h4v4H6v-4zm0 6h4v4H6v-4zm6-12h4v4h-4V6zm0 6h4v4h-4v-4zm0 6h4v4h-4v-4zm6-12h4v4h-4V6zm0 6h4v4h-4v-4zm0 6h4v4h-4v-4z" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24">
      <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l8.99-7L21 7.98l-9-7-9 7 .01.02L12 16zm0-11.47L17.74 9 12 13.47 6.26 9 12 4.53z" />
    </svg>
  ),
  history: (
    <svg viewBox="0 0 24 24">
      <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
    </svg>
  ),
  call: (
    <svg viewBox="0 0 24 24">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  ),
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const BottomNav = ({ currentScreen, onScreenChange }) => {
  const tabCount = tabs.length;
  const tabPercent = 100 / tabCount;
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.id === currentScreen));
  const restingLeftPercent = activeIndex * tabPercent;

  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef(null);
  const [dragLeftPercent, setDragLeftPercent] = useState(null);

  const isDragging = dragLeftPercent !== null;

  const leftPercentFromClientX = (clientX) => {
    const track = trackRef.current;
    if (!track) return restingLeftPercent;
    const rect = track.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100 - tabPercent / 2;
    return clamp(raw, 0, 100 - tabPercent);
  };

  const indexFromLeftPercent = (leftPercent) =>
    clamp(Math.round(leftPercent / tabPercent), 0, tabCount - 1);

  const liveIndex = isDragging ? indexFromLeftPercent(dragLeftPercent) : activeIndex;

  const handlePointerDown = (event) => {
    const track = trackRef.current;
    if (!track) return;
    draggingRef.current = true;
    pointerIdRef.current = event.pointerId;
    track.setPointerCapture(event.pointerId);
    setDragLeftPercent(leftPercentFromClientX(event.clientX));
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return;
    setDragLeftPercent(leftPercentFromClientX(event.clientX));
  };

  const releasePointer = () => {
    const track = trackRef.current;
    if (track?.hasPointerCapture?.(pointerIdRef.current)) {
      track.releasePointerCapture(pointerIdRef.current);
    }
    pointerIdRef.current = null;
  };

  const handlePointerUp = (event) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const finalLeftPercent = leftPercentFromClientX(event.clientX);
    const index = indexFromLeftPercent(finalLeftPercent);
    setDragLeftPercent(null);
    releasePointer();
    const tab = tabs[index];
    if (tab && tab.id !== currentScreen) {
      onScreenChange(tab.id);
    }
  };

  const handlePointerCancel = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragLeftPercent(null);
    releasePointer();
  };

  return (
    <Nav>
      <Track
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <Highlight
          $count={tabCount}
          $dragging={isDragging}
          style={{ left: `${isDragging ? dragLeftPercent : restingLeftPercent}%` }}
        />
        {tabs.map((tab, index) => (
          <TabButton
            key={tab.id}
            type="button"
            $active={index === liveIndex}
            aria-current={index === activeIndex ? 'page' : undefined}
            onClick={() => onScreenChange(tab.id)}
          >
            {icons[tab.icon]}
            <span>{tab.label}</span>
          </TabButton>
        ))}
      </Track>
    </Nav>
  );
};

export default BottomNav;