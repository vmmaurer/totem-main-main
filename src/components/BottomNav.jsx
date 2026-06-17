import React from 'react';
import styled from 'styled-components';

/* ----------------------------------------------------------------
   Liquid glass bottom nav — Apple/iOS tab-bar style (the look used
   in Instagram, WhatsApp, and native iOS tab bars):
   strong blur + saturation + layered inset highlights to fake the
   curved edge of glass catching light, instead of a flat color or
   an SVG distortion filter (which is fragile across browsers and
   was causing the flat blue smear).
------------------------------------------------------------------ */

const Nav = styled.nav`
  position: fixed;
  bottom: clamp(28px, 4vh, 56px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  box-sizing: border-box;
  width: min(92vw, 620px);
  padding: 10px;
  border-radius: 99rem;
  overflow: hidden;
  isolation: isolate;

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.26),
    rgba(255, 255, 255, 0.08)
  );
  backdrop-filter: blur(26px) saturate(180%) contrast(115%) brightness(1.05);
  -webkit-backdrop-filter: blur(26px) saturate(180%) contrast(115%) brightness(1.05);

  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.35),
    inset 0 1.5px 1px rgba(255, 255, 255, 0.9),
    inset 0 -1.5px 1px rgba(0, 0, 0, 0.06),
    inset 0 -12px 18px -14px rgba(255, 255, 255, 0.5),
    0 1px 2px rgba(0, 0, 0, 0.1),
    0 16px 34px rgba(0, 0, 0, 0.22);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      120% 60% at 30% -25%,
      rgba(255, 255, 255, 0.55),
      transparent 60%
    );
    mix-blend-mode: overlay;
    pointer-events: none;
  }
`;

const Track = styled.div`
  position: relative;
  display: flex;
  width: 100%;
`;

const Highlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: calc(100% / ${({ $count }) => $count});
  border-radius: 99rem;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(8px) saturate(160%);
  -webkit-backdrop-filter: blur(8px) saturate(160%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.6),
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    inset 0 -2px 2px rgba(0, 0, 0, 0.08),
    0 4px 10px rgba(0, 0, 0, 0.14);
  transform: translateX(${({ $index }) => `${$index * 100}%`});
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
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
  min-height: 64px;
  padding: 14px 8px;
  border: none;
  border-radius: 99rem;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: ${({ $active }) => ($active ? '#0A84FF' : 'rgba(30, 32, 40, 0.62)')};
  transition: color 200ms ease, transform 160ms ease;

  &:hover svg {
    transform: scale(1.12);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid #0a84ff;
    outline-offset: 3px;
  }

  svg {
    width: 30px;
    height: 30px;
    fill: currentColor;
    transition: transform 200ms cubic-bezier(0.5, 0, 0, 1);
  }

  span {
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
  }
`;

/* ----------------------------------------------------------------
   Tabs + icons (same set as before)
------------------------------------------------------------------ */
const tabs = [
  { id: 'produtos', label: 'Produtos', icon: 'home' },
  { id: 'estrutura', label: 'Estrutura', icon: 'files' },
  { id: 'historia', label: 'História', icon: 'calendar' },
  { id: 'contato', label: 'Contato', icon: 'settings' },
];

const icons = {
  home: (
    <svg viewBox="0 0 24 24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  ),
  files: (
    <svg viewBox="0 0 24 24">
      <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm0 18V4h7v5h5v11H6z" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.33-.02-.64-.06-.94l2.02-1.58c.18-.14.23-.38.12-.56l-1.89-3.28c-.12-.22-.37-.29-.59-.22l-2.38.96c-.5-.38-1.06-.68-1.66-.88l-.36-2.54c-.04-.24-.24-.42-.48-.42h-3.78c-.24 0-.44.18-.48.42l-.36 2.54c-.6.2-1.16.5-1.66.88l-2.38-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.18-.07.42.12.56l2.02 1.58c-.04.3-.06.61-.06.94 0 .33.02.64.06.94l-2.02 1.58c-.18.14-.23.38-.12.56l1.89 3.28c.12.22.37.29.59.22l2.38-.96c.5.38 1.06.68 1.66.88l.36 2.54c.04.24.24.42.48.42h3.78c.24 0 .44-.18.48-.42l.36-2.54c.6-.2 1.16-.5 1.66-.88l2.38.96c.22.08.47 0 .59-.22l1.89-3.28c.12-.22.07-.42-.12-.56l-2.02-1.58zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
    </svg>
  ),
};

const BottomNav = ({ currentScreen, onScreenChange }) => {
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.id === currentScreen));

  return (
    <Nav>
      <Track>
        <Highlight $count={tabs.length} $index={activeIndex} />
        {tabs.map((tab, index) => (
          <TabButton
            key={tab.id}
            type="button"
            $active={index === activeIndex}
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