import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function ProductModal({ product, onClose }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!product) return null

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ animation: 'fadeIn 0.3s ease forwards' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-xl"
        onPointerDown={onClose}
        style={{ animation: 'fadeIn 0.3s ease forwards' }}
      />

      {/* Modal Panel */}
      <div
        className="relative w-full max-w-5xl max-h-[88vh] overflow-hidden rounded-3xl shadow-glass-lg flex flex-col"
        style={{
          background: 'linear-gradient(155deg, rgba(114, 119, 136, 0.98) 0%, rgba(121, 127, 150, 0.99) 100%)',
          border: '1px solid rgba(255,255,255,0.15)',
          animation: 'modalScale 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 z-10 touch-target flex items-center justify-center w-14 h-14 rounded-full"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
          onPointerDown={onClose}
          aria-label="Fechar"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 4L18 18M18 4L4 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row h-full overflow-y-auto">
          {/* Image */}
          <div className="md:w-1/2 flex-shrink-0 h-72 md:h-auto relative overflow-hidden">
            <img
              src={product.modalImage}
              alt={product.title}
              className="w-full h-full object-cover"
              style={{ minHeight: '300px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="md:w-1/2 p-8 md:p-10 overflow-y-auto flex flex-col gap-6">
            <div>
              <p className="text-glass-300 text-sm font-medium tracking-widest uppercase mb-2">
                {product.subtitle}
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
                {product.title}
              </h2>
            </div>

            <p className="text-white/75 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Applications */}
            <div>
              <h3 className="text-glass-300 text-xs font-semibold tracking-widest uppercase mb-3">
                Aplicações
              </h3>
              <div className="flex flex-col gap-2">
                {product.applications.map((app, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-glass-400 flex-shrink-0" />
                    <span className="text-white/80 text-base">{app}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-glass-300 text-xs font-semibold tracking-widest uppercase mb-3">
                Diferenciais
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {product.benefits.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                      <path d="M3.5 9L7 12.5L14.5 5" stroke="#75c2ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-white/85 text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalScale {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    modalRoot
  )
}