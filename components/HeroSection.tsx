'use client'
import React from 'react'

export default function HeroSection() {
  return (
    <header id="inicio" className="hero-section h-screen flex items-center justify-center text-white text-center">
      <div className="relative z-10 px-6 max-w-5xl animate-fade-in mt-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
          Your Executive Transport <br />
          in <span className="gold-text">Atlanta</span>
        </h1>
        <p className="text-lg md:text-xl mb-12 text-slate-200 font-light max-w-2xl mx-auto tracking-wide leading-relaxed">
          Punctuality, discretion, and comfort guaranteed. <br />
          Direct and exclusive service for your complete peace of mind.
        </p>

        <div className="flex items-center justify-center gap-6 md:gap-10 max-w-3xl mx-auto">
          {[
            { icon: 'fa-regular fa-clock', label: 'Punctual' },
            { icon: 'fa-solid fa-shield', label: 'Safe' },
            { icon: 'fa-solid fa-user-tie', label: 'Discreet' },
          ].map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <div className="w-px h-8 bg-white/20" />}
              <div className="flex flex-col items-center gap-3 w-20 md:w-24">
                <i className={`${item.icon} text-[#C5A059] fa-2x`}></i>
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  {item.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="mt-10">
          <a
            href="#reservas"
            onClick={(e) => { e.preventDefault(); document.querySelector('#reservas')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-block px-10 py-4 rounded text-xs font-bold tracking-[0.22em] uppercase gold-bg text-white hover:bg-amber-600 transition shadow-lg"
          >
            Schedule a Ride
          </a>
        </div>
      </div>
    </header>
  )
}
