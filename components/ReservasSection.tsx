'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function ReservasSection() {
  const [origen,   setOrigen]   = useState('')
  const [destino,  setDestino]  = useState('')
  const [fecha,    setFecha]    = useState('')
  const [hora,     setHora]     = useState('')
  const [telefono, setTelefono] = useState('')
  const [correo,   setCorreo]   = useState('')
  const [formState, setFormState] = useState<FormState>('idle')

  const camposCompletos =
    origen.trim() && destino.trim() && fecha && hora &&
    telefono.trim() && correo.trim()

  async function handleSubmit() {
    if (!camposCompletos) return
    setFormState('loading')

    const { error } = await supabase
      .from('prereservas')
      .insert([{ origen, destino, fecha, hora, telefono, correo, estado: 'pendiente' }])

    setFormState(error ? 'error' : 'success')
  }

  function handleReset() {
    setOrigen(''); setDestino(''); setFecha('')
    setHora(''); setTelefono(''); setCorreo('')
    setFormState('idle')
  }

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
  const labelClass = "block text-[10px] uppercase font-bold tracking-[0.1em] text-slate-500 mb-2"

  return (
    // <section id="reservas" className="py-32 bg-slate-50 border-y border-slate-200 scroll-mt-20">
    //<section id="reservas" className="bg-slate-50 py-16 scroll-mt-28 relative">
    <section id="reservas" className="bg-slate-50 py-12 scroll-mt-16 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Columna izquierda — info ── */}
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#C5A059] mb-4 block">
              Reservas Rápidas
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-800 leading-tight">
              Agende su <br /><span className="text-[#C5A059]">traslado</span> hoy.
            </h2>
            <p className="text-slate-500 font-light leading-relaxed text-sm mb-12 max-w-md">
              Complete los detalles de su viaje. Confirmación directa vía WhatsApp, sin intermediarios ni algoritmos.
            </p>

            <div className="space-y-6 border-t border-slate-200 pt-8">
              {[
                { icon: 'fa-solid fa-phone',       text: '+1 (404) 000-0000' },
                { icon: 'fa-brands fa-whatsapp',   text: 'Atención directa por WhatsApp' },
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
                Opciones de pago aceptadas
              </span>
              <div className="flex flex-wrap items-center gap-6">
                {[
                  { icon: 'fa-solid fa-money-bill-1-wave', label: 'Efectivo' },
                  { icon: 'fa-solid fa-credit-card',       label: 'Tarjeta' },
                  { icon: 'fa-solid fa-mobile-screen-button', label: 'Zelle / App' },
                ].map((p) => (
                  <div key={p.label} className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                    <i className={`${p.icon} text-[#C5A059]`} />
                    {p.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Columna derecha — formulario ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-10 md:p-14 shadow-xl">

            {formState === 'success' ? (
              /* ── Estado éxito ── */
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 flex items-center justify-center mb-6">
                  <i className="fa-solid fa-check text-[#C5A059] text-2xl" />
                </div>
                <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#C5A059] mb-3 block">
                  ¡Recibida!
                </span>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Pre-Reserva enviada</h3>
                <p className="text-sm font-light text-slate-500 leading-relaxed mb-8">
                  Revisaremos su solicitud y nos<br />pondremos en contacto a la brevedad.
                </p>
                <button
                  onClick={handleReset}
                  className="px-10 py-3 rounded border border-slate-200 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:border-[#C5A059] hover:text-[#C5A059] transition"
                >
                  Nueva Pre-Reserva
                </button>
              </div>

            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Pre-Reserva</h3>
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400 mb-8">
                  Confirmación humana inmediata
                </p>

                <div className="space-y-5">

                  {/* Origen */}
                  <div>
                    <label className={labelClass}>Punto de Recogida</label>
                    <input
                      type="text"
                      placeholder="Ej: Hartsfield-Jackson Intl Airport"
                      value={origen}
                      onChange={(e) => setOrigen(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  {/* Destino */}
                  <div>
                    <label className={labelClass}>Destino Final</label>
                    <input
                      type="text"
                      placeholder="Ej: Downtown Atlanta Hotel"
                      value={destino}
                      onChange={(e) => setDestino(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  {/* Fecha y Hora */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Fecha</label>
                      <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className={inputClass + ' text-slate-600'}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Hora</label>
                      <input
                        type="time"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        className={inputClass + ' text-slate-600'}
                      />
                    </div>
                  </div>

                  {/* Teléfono y Correo */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Teléfono</label>
                      <input
                        type="tel"
                        placeholder="Ej: +1 (404) 000-0000"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Correo</label>
                      <input
                        type="email"
                        placeholder="Ej: cliente@email.com"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {formState === 'error' && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                      <i className="fa-solid fa-circle-exclamation text-red-400 text-xs" />
                      <p className="text-xs text-red-500 font-medium">
                        Ocurrió un error. Por favor intente nuevamente.
                      </p>
                    </div>
                  )}

                  {/* Botón */}
                  <button
                    onClick={handleSubmit}
                    disabled={!camposCompletos || formState === 'loading'}
                    className="w-full mt-2 bg-[#C5A059] text-white py-4 rounded-lg font-bold text-xs uppercase tracking-[0.2em] hover:bg-amber-600 transition shadow-lg disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {formState === 'loading' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Confirmar Pre-Reserva'
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