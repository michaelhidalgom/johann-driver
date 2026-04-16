'use client'
import React from 'react'

export default function HeroSection() {
  return (
    <header id="inicio" className="hero-section h-screen flex items-center justify-center text-white text-center">
      <div className="relative z-10 px-6 max-w-5xl animate-fade-in mt-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
          Su Transporte Ejecutivo <br />
          en <span className="gold-text">Atlanta</span>
        </h1>
        <p className="text-lg md:text-xl mb-12 text-slate-200 font-light max-w-2xl mx-auto tracking-wide leading-relaxed">
          Puntualidad, discreción y confort garantizados. <br />
          Trato directo y exclusivo para su total tranquilidad.
        </p>

        <div className="flex items-center justify-center gap-6 md:gap-10 max-w-3xl mx-auto">
          {[
            { icon: 'fa-regular fa-clock', label: 'Puntual' },
            { icon: 'fa-solid fa-shield', label: 'Seguro' },
            { icon: 'fa-solid fa-user-tie', label: 'Discreto' },
          ].map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <div className="w-[1px] h-8 bg-white/20" />}
              <div className="flex flex-col items-center gap-3 w-[70px] md:w-[90px]">
                <i className={`${item.icon} text-[#C5A059] fa-2x`}></i>
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  {item.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div
        className="hero-scroll"
        onClick={() => document.querySelector('#mision')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <div className="chevron-wrap">
          <i className="fa-solid fa-chevron-down"></i>
          <i className="fa-solid fa-chevron-down"></i>
        </div>
      </div>
    </header>
  )
}