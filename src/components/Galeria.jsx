import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { galleryImages } from '../data/products'

function GalleryLightbox({ lightbox, onClose }) {
  useEffect(() => {
    if (!lightbox) return
    document.body.style.overflow = 'hidden'
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [lightbox, onClose])

  if (!lightbox) return null

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8"
      style={{ background: 'rgba(1,9,39,0.92)', backdropFilter: 'blur(24px)', animation: 'fadeIn 0.3s ease' }}
      onPointerDown={onClose}
    >
      <button
        className="absolute top-6 right-6 touch-target w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
        onPointerDown={onClose}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 4L16 16M16 4L4 16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>
      <div
        className="relative max-w-4xl w-full rounded-2xl overflow-hidden"
        style={{ animation: 'modalScale 0.4s cubic-bezier(0.22,1,0.36,1)' }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <img
          src={lightbox.src.replace('w=600', 'w=1200')}
          alt={lightbox.alt}
          className="w-full max-h-[80vh] object-cover"
        />
        <div
          className="absolute bottom-0 left-0 right-0 p-6"
          style={{ background: 'linear-gradient(to top, rgba(1,15,64,0.9), transparent)' }}
        >
          <p className="text-white text-lg font-medium">{lightbox.alt}</p>
          <p className="text-white/50 text-sm">Linde Vidros</p>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>,
    modalRoot
  )
}

export default function Galeria() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section
      className="relative px-6 md:px-12"
      style={{
        background: 'linear-gradient(180deg, #040b19 0%, #040b19 50%, #040b19 100%)',
        paddingTop: '60px',
        paddingBottom: '220px',
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-glass-300 text-xs font-semibold tracking-[0.4em] uppercase mb-3">
          
          </p>
          <h2 className="font-display text-5xl font-bold text-white mb-5">
            Galeria
          </h2>
          <div className="w-16 h-0.5 bg-glass-400 mx-auto mb-5" />
          <p className="text-white/50 text-lg">
            Projetos que inspiram arquitetura e design com vidro
          </p>
        </div>

        {/* Grid uniforme 4:3 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((img) => (
            <div
              key={img.id}
              className="relative overflow-hidden rounded-2xl cursor-pointer active:scale-95 transition-transform duration-200"
              style={{ aspectRatio: '4 / 3' }}
              onPointerDown={() => setLightbox(img)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500"
                style={{ transform: 'scale(1)', willChange: 'transform' }}
                draggable={false}
              />
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 flex items-end p-4"
                style={{ background: 'linear-gradient(to top, rgba(1,15,64,0.8), transparent)' }}
              >
                <p className="text-white text-sm font-medium">{img.alt}</p>
              </div>
              {/* Always-visible subtle overlay */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(1,15,64,0.3) 0%, transparent 60%)' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox renderizado via portal */}
      <GalleryLightbox lightbox={lightbox} onClose={() => setLightbox(null)} />
    </section>
  )
}