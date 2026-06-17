import React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(0, 122, 255, 0.404);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 99rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(12px) saturate(180%) contrast(200%);
`;

const TabButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 16px;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  background: transparent;
  color: ${({ $active }) => ($active ? '#007aff' : 'rgba(255, 255, 255, 0.9)')};
  background: ${({ $active }) => ($active ? 'rgb(237, 237, 237, 0.6)' : 'transparent')};
  transition: all 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(2.2deg);
  }
  &:active {
    transform: scale(0.98);
  }
  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
  span {
    font-size: 12px;
    line-height: 1;
  }
`;

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
  return (
    <Nav>
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          $active={currentScreen === tab.id}
          onClick={() => onScreenChange(tab.id)}
        >
          {icons[tab.icon]}
          <span>{tab.label}</span>
        </TabButton>
      ))}
    </Nav>
  );
};

export default BottomNav;