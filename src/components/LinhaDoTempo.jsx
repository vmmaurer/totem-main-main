import React, { useRef, useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'

const milestones = [
  {
    image: '/images/linde_1989.jpeg',
    year: '1989',
    desc: 'Fundação da Linde Vidros, iniciando uma trajetória de inovação e qualidade no setor vidreiro.',
  },
  {
    image: '/images/linde_1991.jpg',
    year: '1991',
    desc: 'Em agosto de 1991 foi fundada uma filial na cidade de Rio Negro – PR para a distribuição em chapas de vidros em geral, atendendo outras regiões.',
  },
  {
    image: '/images/linde_1993.jpg',
    year: '1993',
    desc: 'Nos últimos anos, a unidade de Rio Negro vem investindo em máquinas de última geração para melhor corte e acabamento.',
  },
  {
    image: '/images/linde_1995.jpg',
    year: '1995',
    desc: 'No ano 2000 foi instalado um forno de tempera vertical.',
  },
  {
    image: '/images/linde_2004.jpg',
    year: '2004',
    desc: 'A grande mudança ocorreu em 2003 com a aquisição de um forno de tempera horizontal para vidros de 2,8mm até 19mm.',
  },
  {
    image: '/images/linde_2007.jpg',
    year: '2007',
    desc: 'Em março de 2008 foi instalado seu segundo forno horizontal.',
  },
  {
    image: '/images/linde_2009.jpg',
    year: '2009',
    desc: 'Vidros insulados de alto desempenho para redução do consumo de energia.',
  },
  {
    image: '/images/linde_2012.jpg',
    year: '2012',
    desc: 'Segurança e design com múltiplas camadas de proteção.',
  },
  {
    image: '/images/linde_2014.jpg',
    year: '2014',
    desc: 'Resistência e durabilidade para aplicações de alto impacto.',
  },
  {
    image: '/images/linde_2018.jpg',
    year: '2018',
    desc: 'Isolamento térmico e acústico para maior conforto.',
  },
  {
    image: '/images/linde_2025_1.jpg',
    year: '2025',
    label: 'Fábrica 1',
    desc: 'Personalização com impressão de alta qualidade.',
  },
  {
    image: '/images/linde_2025_2.jpg',
    year: '2025',
    label: 'Fábrica 2',
    desc: 'Espelhos sob medida para todos os ambientes.',
  },
]

const CARD_WIDTH = 240
const CARD_GAP   = 48
const CARD_TOTAL = CARD_WIDTH + CARD_GAP
const SPEED      = 0.55

// ─── Lightbox ──────────────────────────────────────────────────────────────
// Usa createPortal para renderizar direto em #modal-root no body,
// fora da árvore de transforms do slider de telas do App.
function Lightbox({ item, onClose, onPrev, onNext }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!item) return null

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 99999,
        background: 'rgba(2,6,18,0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backdropFilter: 'blur(10px)',
      }}
    >
      <style>{`
        @keyframes lbFade { from{opacity:0} to{opacity:1} }
        @keyframes lbUp { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .lb-overlay { animation: lbFade .2s ease; }
        .lb-modal { animation: lbUp .25s ease; }
      `}</style>
      <div className="lb-overlay" style={{ position: 'absolute', inset: 0 }} />
      <div
        className="lb-modal"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: 720,
          width: '100%',
          background: 'linear-gradient(145deg,rgba(10,22,50,.98),rgba(4,11,25,.98))',
          border: '1px solid rgba(46,164,255,.18)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,.7)',
          zIndex: 1,
        }}
      >
        <div style={{ position: 'relative', maxHeight: 420, overflow: 'hidden' }}>
          <img
            src={item.image}
            alt={item.year}
            style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(4,11,25,1) 0%,rgba(4,11,25,.3) 50%,transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 20, left: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: '#2ea4ff', color: '#040b19', fontWeight: 800, fontSize: 22, padding: '6px 18px', borderRadius: 8 }}>
              {item.year}
            </span>
            {item.label && (
              <span style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, fontWeight: 600 }}>{item.label}</span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 14, width: 36, height: 36,
              borderRadius: '50%', background: 'rgba(0,0,0,.55)', border: '1px solid rgba(255,255,255,.15)',
              color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(46,164,255,.35)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,.55)'}
          >✕</button>
        </div>
        <div style={{ padding: '22px 28px 28px' }}>
          <p style={{ color: 'rgba(255,255,255,.72)', fontSize: 15, lineHeight: 1.75, margin: '0 0 24px' }}>{item.desc}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            {[['← Anterior', onPrev, false], ['Próximo →', onNext, true]].map(([label, fn, primary]) => (
              <button
                key={label}
                onClick={fn}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
                  background: primary ? 'rgba(46,164,255,.12)' : 'rgba(255,255,255,.05)',
                  border: primary ? '1px solid rgba(46,164,255,.3)' : '1px solid rgba(255,255,255,.1)',
                  color: primary ? '#2ea4ff' : 'rgba(255,255,255,.7)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = primary ? 'rgba(46,164,255,.25)' : 'rgba(46,164,255,.15)'}
                onMouseLeave={e => e.currentTarget.style.background = primary ? 'rgba(46,164,255,.12)' : 'rgba(255,255,255,.05)'}
              >{label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  )
}

// ─── Card ──────────────────────────────────────────────────────────────────
function Card({ item, index, onOpen }) {
  const isAbove = index % 2 === 0
  const wasDrag = useRef(false)

  const badge = (
    <div style={{ textAlign: 'center', padding: isAbove ? '0 0 6px' : '6px 0 0', flexShrink: 0 }}>
      <span style={{
        display: 'inline-block', background: '#2ea4ff', color: '#040b19',
        fontWeight: 800, fontSize: 13, letterSpacing: '.05em', padding: '4px 12px', borderRadius: 6,
      }}>{item.year}</span>
      {item.label && (
        <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 11, margin: '4px 0 0', fontWeight: 600 }}>{item.label}</p>
      )}
    </div>
  )

  const connector = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      <div style={{ width: 2, height: 28, background: 'rgba(46,164,255,.5)' }} />
      <div style={{
        width: 13, height: 13, borderRadius: '50%', flexShrink: 0,
        background: '#2ea4ff', boxShadow: '0 0 14px rgba(46,164,255,.9)',
      }} />
      <div style={{ width: 2, height: 28, background: 'rgba(46,164,255,.5)' }} />
    </div>
  )

  const cardVisual = (
    <div
      onMouseDown={() => { wasDrag.current = false }}
      onMouseMove={() => { wasDrag.current = true }}
      onMouseUp={() => { if (!wasDrag.current) onOpen() }}
      onTouchEnd={() => onOpen()}
      style={{
        width: CARD_WIDTH, flexShrink: 0,
        background: 'linear-gradient(180deg, #0b1830 0%, #091426 100%)',
        border: '1px solid rgba(255,255,255,.11)',
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 6px 30px rgba(0,0,0,.5)',
        cursor: 'pointer',
        transition: 'transform .25s ease, box-shadow .25s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(46,164,255,.25)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 6px 30px rgba(0,0,0,.5)' }}
    >
      <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
        <img src={item.image} alt={item.year} draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(4,11,25,.82) 0%,transparent 55%)' }} />
        <div style={{
          position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(46,164,255,.2)', border: '1px solid rgba(46,164,255,.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
        }}>🔍</div>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
      </div>
    </div>
  )

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      width: CARD_WIDTH, flexShrink: 0, userSelect: 'none',
    }}>
      {isAbove ? (<>{badge}{connector}{cardVisual}</>) : (<>{cardVisual}{connector}{badge}</>)}
    </div>
  )
}

// ─── Componente principal ──────────────────────────────────────────────────
export default function LinhaDoTempo() {
  const trackRef     = useRef(null)
  const offsetRef    = useRef(0)
  const rafRef       = useRef(null)
  const isDragging   = useRef(false)
  const dragStartX   = useRef(0)
  const dragStartOff = useRef(0)
  const isPaused     = useRef(false)
  const resumeTimer  = useRef(null)
  const [selected, setSelected] = useState(null)

  const items     = [...milestones, ...milestones, ...milestones]
  const loopWidth = milestones.length * CARD_TOTAL

  const clamp = (v) => {
    if (v >= loopWidth * 2) return v - loopWidth
    if (v < loopWidth)      return v + loopWidth
    return v
  }

  const animate = useCallback(() => {
    if (!isPaused.current) offsetRef.current = clamp(offsetRef.current + SPEED)
    if (trackRef.current) trackRef.current.style.transform = `translateX(${-offsetRef.current}px)`
    rafRef.current = requestAnimationFrame(animate)
  }, [loopWidth])

  useEffect(() => {
    offsetRef.current = loopWidth
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate, loopWidth])

  useEffect(() => { if (selected !== null) isPaused.current = true }, [selected])

  const pauseAuto = () => { isPaused.current = true; clearTimeout(resumeTimer.current) }
  const resumeAuto = () => {
    if (selected !== null) return
    resumeTimer.current = setTimeout(() => { isPaused.current = false }, 1500)
  }

  const openCard  = (i) => setSelected(i % milestones.length)
  const closeCard = () => { setSelected(null); resumeTimer.current = setTimeout(() => { isPaused.current = false }, 800) }
  const prevCard  = () => setSelected(s => (s - 1 + milestones.length) % milestones.length)
  const nextCard  = () => setSelected(s => (s + 1) % milestones.length)

  const onMouseDown  = (e) => { e.stopPropagation(); isDragging.current = true; dragStartX.current = e.clientX; dragStartOff.current = offsetRef.current; pauseAuto(); e.currentTarget.style.cursor = 'grabbing' }
  const onMouseMove  = (e) => { if (!isDragging.current) return; offsetRef.current = clamp(dragStartOff.current + (dragStartX.current - e.clientX)) }
  const onMouseUp    = (e) => { if (!isDragging.current) return; isDragging.current = false; e.currentTarget.style.cursor = 'grab'; resumeAuto() }
  const onTouchStart = (e) => { e.stopPropagation(); dragStartX.current = e.touches[0].clientX; dragStartOff.current = offsetRef.current; pauseAuto() }
  const onTouchMove  = (e) => { offsetRef.current = clamp(dragStartOff.current + (dragStartX.current - e.touches[0].clientX)) }
  const onTouchEnd   = () => resumeAuto()

  return (
    // Fragment para que o Lightbox fique FORA do flow da section
    // e não seja afetado por overflow:hidden
    <>
      {/* Lightbox renderizado via portal em #modal-root */}
      {selected !== null && (
        <Lightbox item={milestones[selected]} onClose={closeCard} onPrev={prevCard} onNext={nextCard} />
      )}

      <section style={{
        position: 'relative',
        padding: '24px 0 40px',
        background: 'transparent',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 1000, height: 500,
          background: 'radial-gradient(ellipse,rgba(46,164,255,.07) 0%,transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Cabeçalho — fica perto do topo, não no meio do espaço livre */}
        <div style={{ textAlign: 'center', marginBottom: 40, position: 'relative', zIndex: 10, flexShrink: 0 }}>
          <p style={{ color: 'rgba(46,164,255,.85)', fontSize: 11, fontWeight: 700, letterSpacing: '.4em', textTransform: 'uppercase', margin: '0 0 12px' }}>
            Quem Somos?
          </p>
          <h2 style={{ color: '#fff', fontSize: 44, fontWeight: 800, margin: '0 0 16px', letterSpacing: '-.02em' }}>
            A Linde Vidros
          </h2>
          <div style={{ width: 48, height: 2, background: 'rgba(46,164,255,.5)', margin: '0 auto 14px', borderRadius: 2 }} />
          <p style={{ color: 'rgba(255,255,255,.28)', fontSize: 12, margin: 0 }}>
            Clique em um card para ver mais · Arraste para explorar
          </p>
        </div>

        {/* Carrossel — centralizado no espaço restante (flex:1) */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
          <div
            style={{ position: 'relative', overflow: 'hidden', cursor: 'grab', width: '100%' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Linha horizontal--- */}
            <div style={{
              position: 'absolute', top: '50%', left: 0, right: 0,
              height: 2, marginTop: -1,
              background: 'rgba(46,164,255,.32)',
              pointerEvents: 'none', zIndex: 0,
            }} />

            {/* Track */}
            <div
              ref={trackRef}
              style={{
                position: 'relative', zIndex: 1,
                display: 'inline-flex', alignItems: 'center',
                gap: 0, willChange: 'transform',
                padding: '20px 0',
              }}
            >
              {items.map((item, i) => (
                <div key={i} style={{ margin: `0 ${CARD_GAP / 2}px` }}>
                  <Card item={item} index={i} onOpen={() => openCard(i)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}