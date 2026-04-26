'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Dictionary } from '@/lib/dictionary'

type FormState = 'idle' | 'loading' | 'success' | 'error'
type Props = { dict: Dictionary['reservas'] }

export default function ReservasSection({ dict }: Props) {
  const [nombre,   setNombre]   = useState('')
  const [origen,   setOrigen]   = useState('')
  const [destino,  setDestino]  = useState('')
  const [fecha,    setFecha]    = useState('')
  const [hora,     setHora]     = useState('')
  const [telefono, setTelefono] = useState('')
  const [correo,   setCorreo]   = useState('')
  const [formState, setFormState] = useState<FormState>('idle')

  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())

  const camposCompletos =
    nombre.trim() && origen.trim() && destino.trim() &&
    fecha && hora && telefono.trim() && correoValido

  async function handleSubmit() {
    if (!camposCompletos) return
    setFormState('loading')

    const { error } = await supabase
      .from('prereservas')
      .insert([{ nombre, origen, destino, fecha, hora, telefono, correo, estado: 'pendiente' }])

    setFormState(error ? 'error' : 'success')
  }

  function handleReset() {
    setNombre(''); setOrigen(''); setDestino(''); setFecha('')
    setHora(''); setTelefono(''); setCorreo('')
    setFormState('idle')
  }

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
  const labelClass = "block text-[10px] uppercase font-bold tracking-[0.1em] text-slate-500 mb-2"

  return (
    <section id="reservas" className="bg-slate-50 pt-8 pb-16 scroll-mt-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Left column — info ── */}
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#C5A059] mb-4 block">
              {dict.badge}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-800 leading-tight">
              {dict.heading1} <br /><span className="text-[#C5A059]">{dict.heading2}</span> {dict.heading3}
            </h2>
            <p className="text-slate-500 font-light leading-relaxed text-sm mb-12 max-w-md">
              {dict.subtitle}
            </p>

            <div className="space-y-6 border-t border-slate-200 pt-8">
              {[
                { icon: 'fa-solid fa-phone',     text: '+1 (678) 907-2703' },
                { icon: 'fa-brands fa-whatsapp', text: dict.whatsapp },
                { icon: 'fa-solid fa-envelope',  text: 'johanngarcia@personaldriveratl.com' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-[#C5A059] shadow-sm">
                    <i className={`${item.icon} text-sm`} />
                  </div>
                  <span className="font-medium text-slate-700 text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-200">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 mb-4 block">
                {dict.payment_title}
              </span>
              <div className="flex flex-wrap items-center gap-6">
                {[
                  { icon: 'fa-solid fa-money-bill-1-wave',    label: dict.cash },
                  { icon: 'fa-solid fa-credit-card',          label: dict.card, note: dict.card_note },
                  { icon: 'fa-solid fa-mobile-screen-button', label: dict.zelle },
                ].map((p) => (
                  <div key={p.label} className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                    <i className={`${p.icon} text-[#C5A059]`} />
                    {p.label}
                    {'note' in p && p.note && (
                      <span className="text-[10px] font-bold tracking-wide text-slate-400">{p.note}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column — form ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-8 md:p-14 shadow-xl">

            {formState === 'success' ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 flex items-center justify-center mb-6">
                  <i className="fa-solid fa-check text-[#C5A059] text-2xl" />
                </div>
                <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#C5A059] mb-3 block">
                  {dict.success_badge}
                </span>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{dict.success_title}</h3>
                <p className="text-sm font-light text-slate-500 leading-relaxed mb-8">
                  {dict.success_text}
                </p>
                <button
                  onClick={handleReset}
                  className="px-10 py-3 rounded border border-slate-200 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:border-[#C5A059] hover:text-[#C5A059] transition"
                >
                  {dict.new_booking}
                </button>
              </div>

            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{dict.form_title}</h3>
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400 mb-8">
                  {dict.form_subtitle}
                </p>

                <div className="space-y-5">

                  <div>
                    <label className={labelClass}>{dict.name}</label>
                    <input
                      type="text"
                      placeholder={dict.name_placeholder}
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>{dict.pickup}</label>
                    <input
                      type="text"
                      placeholder={dict.pickup_placeholder}
                      value={origen}
                      onChange={(e) => setOrigen(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>{dict.destination}</label>
                    <input
                      type="text"
                      placeholder={dict.destination_placeholder}
                      value={destino}
                      onChange={(e) => setDestino(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>{dict.date}</label>
                      <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className={inputClass + ' text-slate-600'}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{dict.time}</label>
                      <input
                        type="time"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        className={inputClass + ' text-slate-600'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>{dict.phone}</label>
                      <input
                        type="tel"
                        placeholder={dict.phone_placeholder}
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{dict.email}</label>
                      <input
                        type="email"
                        placeholder={dict.email_placeholder}
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className={inputClass + (!correoValido && correo.trim() ? ' border-red-300 focus:border-red-400 focus:ring-red-400' : '')}
                      />
                      {!correoValido && correo.trim() && (
                        <p className="text-[10px] text-red-400 font-medium mt-1.5">{dict.email_error}</p>
                      )}
                    </div>
                  </div>

                  {formState === 'error' && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                      <i className="fa-solid fa-circle-exclamation text-red-400 text-xs" />
                      <p className="text-xs text-red-500 font-medium">{dict.error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!camposCompletos || formState === 'loading'}
                    className="w-full mt-2 bg-[#C5A059] text-white py-4 rounded-lg font-bold text-xs uppercase tracking-[0.2em] hover:bg-amber-600 transition shadow-lg disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {formState === 'loading' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        {dict.sending}
                      </>
                    ) : (
                      dict.submit
                    )}
                  </button>

                </div>
              </>
            )}

          </div>

        </div>
      </div>
    </section>
  )
}
