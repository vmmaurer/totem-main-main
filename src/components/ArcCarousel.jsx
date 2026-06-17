import React, { useState, useEffect, useRef, useCallback } from 'react'

export default function ArcCarousel({ items, onCardTap }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const dragOffsetRef = useRef(0)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null) 
  const autoRotateTimer = useRef(null)
  const resumeTimer = useRef(null)
  const dragStartX = useRef(0)
  const containerRef = useRef(null)
  const count = items.length

   // Detecta mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-rotate
  const startAutoRotate = useCallback(() => {
    clearInterval(autoRotateTimer.current)
    autoRotateTimer.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % count)
    }, 4000)
  }, [count])

  const pauseAndScheduleResume = useCallback(() => {
    clearInterval(autoRotateTimer.current)
    clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => {
      startAutoRotate()
    }, 3500)
  }, [startAutoRotate])

  useEffect(() => {
    startAutoRotate()
    return () => {
      clearInterval(autoRotateTimer.current)
      clearTimeout(resumeTimer.current)
    }
  }, [startAutoRotate])

  const goTo = useCallback((idx) => {
    if (isAnimating) return
    setCurrentIndex(((idx % count) + count) % count)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, count])

  const goNext = useCallback(() => {
    goTo(currentIndex + 1)
    pauseAndScheduleResume()
  }, [currentIndex, goTo, pauseAndScheduleResume])

  const goPrev = useCallback(() => {
    goTo(currentIndex - 1)
    pauseAndScheduleResume()
  }, [currentIndex, goTo, pauseAndScheduleResume])

  // Touch handlers
  const handlePointerDown = (e) => {
    touchStartX.current = e.clientX
    touchStartY.current = e.clientY
    dragStartX.current = e.clientX
    setIsDragging(true)
    pauseAndScheduleResume()
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!isDragging || touchStartX.current === null) return
    const delta = e.clientX - dragStartX.current
    setDragOffset(delta)
    dragOffsetRef.current = delta // ← adicione esta linha
    
  // ← CORRIGIDO: código estava fora da função
    const deltaY = Math.abs(e.clientY - (touchStartY.current || e.clientY))
    const deltaX = Math.abs(delta)
    
    // Só previne scroll se arrastar mais horizontalmente que verticalmente
    if (deltaX > deltaY && deltaX > 15) {
      e.preventDefault()
    }
  }
  const handlePointerUp = (e) => {
    if (!isDragging) return
    const delta = e.clientX - (touchStartX.current || e.clientX)

    // Calcula movimento baseado na distância
  const cardWidth = 350
  const cardsToMove = Math.max(1, Math.round(Math.abs(delta) / cardWidth))
  const threshold = 30 // ← mais sensível ainda

    if (Math.abs(delta) > threshold) {
       if (delta < 0) {
        goTo(currentIndex + cardsToMove) // ← CORRIGIDO: usa cardsToMove
      } else {
        goTo(currentIndex - cardsToMove) // ← CORRIGIDO: usa cardsToMove
      }
    }
    setIsDragging(false)
    setDragOffset(0)
     dragOffsetRef.current = 0 // ← adicione esta linha
    touchStartX.current = null
  }

  const handlePointerCancel = () => {
    setIsDragging(false)
    setDragOffset(0)
    touchStartX.current = null
  }

  // Card tap — only if we didn't drag
  const handleCardTap = (item, itemIndex) => {
      if (Math.abs(dragOffsetRef.current) > 10) return // ← usa ref
    if (itemIndex === currentIndex) {
      onCardTap(item)
    } else {
      goTo(itemIndex)
      pauseAndScheduleResume()
    }
  }

  // Calculate card positions (arc layout)
  const getCardStyle = (index) => {
    const total = count
    // Angular position relative to current
    let diff = index - currentIndex
    // Normalize to [-total/2, total/2]
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total

    // Apply drag offset in angle
    const dragAngle = (dragOffset / 400) * 35
    const angle = diff * 35 + dragAngle

    // Max visible range ±2 cards on each side
    const visible = Math.abs(diff) <= 3

    const rad = (angle * Math.PI) / 180
    const radius = 700 // arc radius in px
    const x = radius * Math.sin(rad)
    const z = radius * (Math.cos(rad) - 1) // negative = goes back

    const scale = 1 - Math.abs(angle) * 0.0025
    const opacity = Math.abs(diff) > 2.5 ? 0 : 1 - Math.abs(angle) * 0.009
    const zIndex = 100 - Math.abs(Math.round(diff))

    return {
      transform: `translate3d(${x}px, 0, ${z}px) scale(${Math.max(scale, 0.6)})`,
      opacity: Math.max(opacity, 0),
      zIndex: zIndex,
      pointerEvents: visible ? 'auto' : 'none',
      transition: isDragging
        ? 'none'
        : 'transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease',
    }
  }

  const CARD_W = isMobile ? 280 : 320
  const CARD_H = isMobile ? 400 : 460

  return (
    <div className="relative w-full select-none" style={{ height: `${CARD_H + 120}px` }}>
      {/* 3D perspective container */}
      <div
        ref={containerRef}
        className="relative w-full h-full"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 40%',
          touchAction: 'pan-y', // permite scroll vertical
          WebkitTouchCallout: 'none', // previne menu de contexto no iOS
          paddingTop: '40px', // ← área extra de toque no topo
          paddingBottom: '40px', // ← área extra de toque embaixo
          marginTop: '-40px',
          marginBottom: '-40px',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {/* Cards layer */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {items.map((item, idx) => {
            const isActive = idx === currentIndex
            const cardStyle = getCardStyle(idx)

            return (
              <div
                key={item.id}
                className="absolute rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  width: `${CARD_W}px`,
                  height: `${CARD_H}px`,
                  boxShadow: isActive
                    ? '0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(117,194,255,0.15)'
                    : '0 16px 40px rgba(0,0,0,0.4)',
                  border: isActive
                    ? '1px solid rgba(117,194,255,0.4)'
                    : '1px solid rgba(255,255,255,0.1)',
                  ...cardStyle,
                  willChange: 'transform, opacity',
                }}
                  onClick={(e) => {                    // ← trocou onPointerUp por onClick
    e.stopPropagation()
    if (Math.abs(dragOffsetRef.current) > 10) return  // ← ignora se arrastou
    if (idx === currentIndex) {
      onCardTap(item)                  // ← abre o modal
    } else {
      goTo(idx)
      pauseAndScheduleResume()
    }
  }}
>
                {/* Background image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(1,15,64,0.95) 0%, rgba(1,15,64,0.4) 50%, rgba(1,15,64,0.1) 100%)',
                  }}
                />

                {/* Glass shine top-left */}
                <div
                  className="absolute top-0 left-0 w-2/3 h-1/3 rounded-br-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {/* Category tag */}
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-xs font-medium tracking-wider uppercase"
                    style={{ background: 'rgba(117,194,255,0.2)', border: '1px solid rgba(117,194,255,0.35)', color: '#b6dcff' }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-glass-300" />
                    Soluções em Vidro
                  </div>
                  <h3 className="text-white font-display text-2xl font-bold leading-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm font-medium mb-4">
                    {item.subtitle}
                  </p>

                  {/* Tap indicator — only on active card */}
                  {isActive && (
                    <div
                      className="flex items-center gap-2 text-glass-300 text-xs font-medium"
                      style={{
                        animation: 'pulseOpacity 2.5s ease-in-out infinite',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2V8L11 11" stroke="#75c2ff" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="8" cy="8" r="6.5" stroke="#75c2ff" strokeWidth="1.5" opacity="0.5"/>
                      </svg>
                      Toque para saber mais
                    </div>
                  )}
                </div>

                {/* Active border glow */}
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 0 0 1.5px rgba(117,194,255,0.5)',
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Nav arrows */}
      <button
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 touch-target flex items-center justify-center w-14 h-14 rounded-full"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}
        onPointerDown={(e) => { e.stopPropagation(); goPrev() }}
        aria-label="Anterior"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M13 4L7 10L13 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 touch-target flex items-center justify-center w-14 h-14 rounded-full"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}
        onPointerDown={(e) => { e.stopPropagation(); goNext() }}
        aria-label="Próximo"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7 4L13 10L7 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            className="touch-target flex items-center justify-center"
            style={{ minWidth: 28, minHeight: 28 }}
            onPointerDown={(e) => { e.stopPropagation(); goTo(idx); pauseAndScheduleResume() }}
            aria-label={`Slide ${idx + 1}`}
          >
            <div
              style={{
                width: idx === currentIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: idx === currentIndex ? '#75c2ff' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          </button>
        ))}
      </div>

      <style>{`
        @keyframes pulseOpacity {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  )
}
