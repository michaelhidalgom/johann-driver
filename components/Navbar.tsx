'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#mision', label: 'Ventajas' },
    { href: '#reservas', label: 'Reservas' },
    { href: '#testimonios', label: 'Opiniones' },
  ]

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">

        <Link href="#inicio" className="flex items-center gap-3.5">
          <Image
            src="/logo.png"
            alt="Johann Driver Logo"
            height={48}
            width={160}
            style={{ width: 'auto' }}
            className="h-12 object-contain"
          />
        </Link>

        <div className="hidden lg:flex space-x-10 font-semibold text-[11px] uppercase tracking-[0.22em] text-slate-700 items-center">
          {links.map(l => (
            <a key={l.href} href={l.href} className="hover:text-[#C5A059] transition border-b border-transparent hover:border-[#C5A059] pb-1">
              {l.label}
            </a>
          ))}
        </div>

        <a href="tel:+16789072703" className="hidden md:inline-flex items-center gap-2.5 px-7 py-2.5 rounded text-xs font-bold tracking-[0.15em] uppercase border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition">
          <i className="fa-solid fa-phone text-xs"></i>
          +1 (678) 907-2703
        </a>

        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-slate-800 text-2xl focus:outline-none transition-transform duration-300">
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-black/5 absolute w-full shadow-xl">
          <div className="flex flex-col px-6 py-6 space-y-5 text-xs font-semibold tracking-[0.2em] uppercase text-slate-700 text-center">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="hover:text-[#C5A059] transition">
                {l.label}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-100">
              <a href="tel:+16789072703" onClick={() => setMenuOpen(false)} className="inline-flex items-center gap-2.5 px-8 py-3 rounded text-xs font-bold tracking-[0.15em] uppercase border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition">
                <i className="fa-solid fa-phone text-xs"></i>
                +1 (678) 907-2703
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}