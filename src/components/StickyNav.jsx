import React, { useState, useEffect } from 'react'

const NAV_HEIGHT = 120

const navItems = [
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Diferenciais', href: '#diferenciais' },
  { label: 'Processo', href: '#processo' },
  { label: 'Transformações', href: '#antes-depois' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Contato', href: '#contato' },
]

export default function StickyNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [fabOpen, setFabOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href) => {
    setMenuOpen(false)
    setTimeout(() => {
      const el = document.querySelector(href)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }, 300)
  }

  return (
  <>
      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
        style={{
          height: `${NAV_HEIGHT}px`,
          background: 'rgba(4,11,25,0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.03)',
        }}
      >
        <div
          className="max-w-7xl mx-auto px-8 h-full"
          style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 80px',
            alignItems: 'center',
          }}
        >
          {/* Esquerda — Hamburguer */}
          <div className="flex items-center">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              className="flex flex-col justify-center gap-[5px] p-2 rounded-lg transition-all duration-200"
              style={{ background: menuOpen ? 'rgba(255,255,255,0.07)' : 'transparent' }}
            >
              <span
                className="block w-6 h-[2px] rounded transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                }}
              />
              <span
                className="block w-6 h-[2px] rounded transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-6 h-[2px] rounded transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                }}
              />
            </button>
          </div>

          {/* Centro — Logo */}
          <div
            className="flex items-center justify-center cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/images/logonavbar.png"
              alt="Linde Vidros 60 anos"
              style={{
                height: `${NAV_HEIGHT - -18}px`,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>

 {/* Direita — Botão E-commerce */}
<div className="flex items-center justify-end">
  
   <a href="https://ecommerce.lindevidros.com.br/Login.aspx?ReturnUrl=%2f"
    target="_blank"
    rel="noopener noreferrer"
    className="transition-all duration-300 active:scale-95 hover:scale-105 hover:opacity-90"
  >
    <img
      src="/images/ECOMMERCE HORIZONTAL.png"
      alt="E-commerce Linde Vidros"
      style={{
        height: `${NAV_HEIGHT - 30}px`,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  </a>
</div>
        </div>
      </nav>

      {/* ── MENU DROPDOWN ── */}
      <div
        style={{
          position: 'fixed',
          top: `${NAV_HEIGHT}px`,
          left: '32px', 
          right: 'auto',
          width: '200px',
          borderRadius:'20px',
          zIndex: 49,                // ← z-index direto no style, não classe Tailwind
          background: 'rgba(4,11,25,0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: menuOpen ? '1px solid rgba(255,255,255,0.08)' : 'none',
          transform: menuOpen ? 'translateY(0)' : 'translateY(-120%)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.3s ease',
        }}
      >
        {navItems.map((item, i) => (
          <React.Fragment key={item.href}>
            <button
              className="text-left px-6 py-3 text-sm font-medium tracking-wider transition-all duration-200"
              style={{ color: 'rgba(255,255,255,0.75)', background: 'transparent' }}
              onClick={() => scrollTo(item.href)}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#75c2ff'
                e.currentTarget.style.background = 'rgba(117,194,255,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {item.label}
            </button>
            {i < navItems.length - 1 && (
              <div style={{ 
      height: '1px',
      width: '70%',
      margin: '0 auto',
      background: 'rgba(255,255,255,0.05)' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Overlay — fecha ao clicar fora */}
    {menuOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 48 }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── WHATSAPP FAB ── */}
      
     <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
  {/* Opções expandidas */}
  <div
    style={{
      position: 'absolute',
      bottom: '90px',
      right: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '12px',
      transform: fabOpen ? 'translateY(0) translateX(-5px) scale(1)'
  : 'translateY(20px) translateX(10px) scale(0.8)',
      opacity: fabOpen ? 1 : 0,
      pointerEvents: fabOpen ? 'auto' : 'none',
      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    }}
  >
    {/* WhatsApp */}
    
     <a href="https://wa.me/554736414444?text=Ol%C3%A1%2C%20estou%20entrando%20em%20contato%20por%20meio%20do%20site%20e%20gostaria%20de%20conhecer%20melhor%20as%20solu%C3%A7%C3%B5es%20oferecidas%20pela%20Linde%20Vidros."
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 group active:scale-95 transition-transform"
    >
      <span className="text-white text-sm font-medium whitespace-nowrap bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg">
        WhatsApp
      </span>
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
        style={{ background: '#25D366', boxShadow: '0 4px 12px rgba(37,211,102,0.4)' }}
      >
        <svg viewBox="0 0 24 24" fill="white" width={22} height={22}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </div>
    </a>

    {/* Instagram */}
    
      <a href="https://www.instagram.com/lindevidros/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 group active:scale-95 transition-transform"
    >
      <span className="text-white text-sm font-medium whitespace-nowrap bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg">
        Instagram
      </span>
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
        style={{ 
          background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%)',
          boxShadow: '0 4px 12px rgba(253,29,29,0.4)'
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" width={22} height={22}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      </div>
    </a>

    {/* LinkedIn */}
    
      <a href="https://www.linkedin.com/company/linde-vidros/" // ← coloque o link correto
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 group active:scale-95 transition-transform"
    >
      <span className="text-white text-sm font-medium whitespace-nowrap bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg">
        LinkedIn
      </span>
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
        style={{ background: '#0A66C2', boxShadow: '0 4px 12px rgba(10,102,194,0.4)' }}
      >
        <svg viewBox="0 0 24 24" fill="white" width={22} height={22}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </div>
    </a>
  </div>

  {/* Botão principal */}
  <button
    onClick={() => setFabOpen(v => !v)}
    className="w-14 h-14 md:w-[56px] md:h-[56px] rounded-full flex items-center justify-center transition-all active:scale-95 group relative"
    style={{
      background: fabOpen 
        ? 'linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%)'
        : 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
      boxShadow: fabOpen
        ? '0 6px 20px rgba(255,71,87,0.5)'
        : '0 6px 20px rgba(74,144,226,0.4)',
    }}
  >
    {/* Ícone muda de + para X */}
    <div
      style={{
        transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </div>
  </button>

  {/* Label abaixo */}
  <span 
    className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] tracking-widest text-white/90 font-semibold uppercase whitespace-nowrap"
    style={{
      opacity: fabOpen ? 0 : 1,
      transition: 'opacity 0.2s',
    }}
  >
    Fale Conosco
  </span>
</div>
</>
)
}