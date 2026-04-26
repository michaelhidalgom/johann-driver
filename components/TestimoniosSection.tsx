'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Dictionary } from '@/lib/dictionary'

type Testimonio = {
  id: number
  nombre: string
  estrellas: number
  texto: string
}

type FormState = 'idle' | 'loading' | 'success' | 'error'
type Props = { dict: Dictionary['testimonios'] }

function getInitials(nombre: string): string {
  return nombre.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase() ?? '').join('')
}

function getAvatarColor(index: number): string {
  return index % 2 === 0 ? 'bg-slate-200 text-slate-600' : 'bg-[#C5A059]/20 text-[#C5A059]'
}

const PER_PAGE = 3

export default function TestimoniosSection({ dict }: Props) {
  const [testimonios, setTestimonios]   = useState<Testimonio[]>([])
  const [loadingData, setLoadingData]   = useState(true)
  const [page, setPage]                 = useState(0)
  const [modalOpen, setModalOpen]       = useState(false)

  const [nombre, setNombre]       = useState('')
  const [estrellas, setEstrellas] = useState(5)
  const [texto, setTexto]         = useState('')
  const [formState, setFormState] = useState<FormState>('idle')

  useEffect(() => {
    async function fetchTestimonios() {
      const { data, error } = await supabase
        .from('testimonios')
        .select('id, nombre, estrellas, texto')
        .eq('estado', 'aprobado')
        .order('created_at', { ascending: false })

      if (!error && data) setTestimonios(data)
      setLoadingData(false)
    }
    fetchTestimonios()
  }, [])

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modalOpen])

  const maxPage  = Math.ceil(testimonios.length / PER_PAGE) - 1
  const start    = page * PER_PAGE
  const visibles = testimonios.slice(start, start + PER_PAGE)

  async function handleSubmit() {
    if (!nombre.trim() || !texto.trim()) return
    setFormState('loading')
    const { error } = await supabase
      .from('testimonios')
      .insert([{ nombre: nombre.trim(), estrellas, texto: texto.trim(), estado: 'pendiente' }])
    setFormState(error ? 'error' : 'success')
  }

  function handleClose() {
    setModalOpen(false)
    setTimeout(() => {
      setNombre('')
      setEstrellas(5)
      setTexto('')
      setFormState('idle')
    }, 300)
  }

  return (
    <>
      <section id="testimonios" className="py-12 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              {dict.heading1} <span className="text-[#C5A059]">{dict.heading2}</span>
            </h2>
            <p className="mt-2 text-sm font-light text-slate-400 tracking-wide">
              {dict.subtitle}
            </p>
          </div>

          {loadingData && (
            <div className="flex justify-center items-center py-16">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-[#C5A059] rounded-full animate-spin" />
            </div>
          )}

          {!loadingData && testimonios.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-12">{dict.empty}</p>
          )}

          {!loadingData && testimonios.length > 0 && (
            <>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                {visibles.map((t, i) => (
                  <div key={t.id} className="bg-slate-50 p-6 rounded-xl border border-slate-100 transition hover:shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex text-[#C5A059] mb-4 text-xs gap-1">
                        {[...Array(t.estrellas)].map((_, j) => <i key={j} className="fa-solid fa-star" />)}
                        {[...Array(5 - t.estrellas)].map((_, j) => <i key={j} className="fa-regular fa-star text-slate-300" />)}
                      </div>
                      <p className="text-sm font-light text-slate-600 mb-5 leading-relaxed">"{t.texto}"</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 shrink-0 ${getAvatarColor(start + i)} rounded-full flex items-center justify-center font-bold text-xs`}>
                        {getInitials(t.nombre)}
                      </div>
                      <p className="font-bold text-sm text-slate-800">{t.nombre}</p>
                    </div>
                  </div>
                ))}
              </div>

              {maxPage > 0 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-[0.1em]">
                    {dict.showing} {Math.min((page + 1) * PER_PAGE, testimonios.length)} {dict.of} {testimonios.length}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="px-5 py-2 text-xs font-bold uppercase tracking-[0.1em] border border-slate-200 rounded text-slate-500 hover:border-[#C5A059] hover:text-[#C5A059] transition disabled:opacity-30 disabled:pointer-events-none"
                    >
                      {dict.previous}
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(maxPage, p + 1))}
                      disabled={page === maxPage}
                      className="px-5 py-2 text-xs font-bold uppercase tracking-[0.1em] bg-[#C5A059] text-white rounded hover:bg-amber-600 transition disabled:opacity-30 disabled:pointer-events-none"
                    >
                      {dict.next}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-7 pt-7 border-t border-slate-200 flex flex-col items-center gap-3 text-center">
            <i className="fa-regular fa-comment-dots text-slate-300 text-3xl" />
            <p className="text-sm font-light text-slate-500">
              {dict.cta_text} <br /> {dict.cta_sub}
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-[#C5A059] text-white px-8 py-3 rounded text-xs font-bold uppercase tracking-[0.2em] hover:bg-amber-600 transition shadow-md"
            >
              {dict.cta_button}
            </button>
          </div>

        </div>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(10, 25, 47, 0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md p-10">

            {formState !== 'success' ? (
              <>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#C5A059] mb-2 block">
                      {dict.modal_badge}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-800">{dict.modal_title}</h3>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400 mt-1">
                      {dict.modal_subtitle}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition text-sm"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-[0.1em] text-slate-500 mb-2">
                      {dict.name}
                    </label>
                    <input
                      type="text"
                      placeholder={dict.name_placeholder}
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-[0.1em] text-slate-500 mb-3">
                      {dict.rating}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setEstrellas(n)}
                          className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                          style={{ color: n <= estrellas ? '#C5A059' : '#CBD5E1' }}
                        >
                          <i className={n <= estrellas ? 'fa-solid fa-star' : 'fa-regular fa-star'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-[0.1em] text-slate-500 mb-2">
                      {dict.experience}
                    </label>
                    <textarea
                      rows={4}
                      placeholder={dict.experience_placeholder}
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all resize-none"
                    />
                  </div>

                  {formState === 'error' && (
                    <p className="text-xs text-red-500 font-medium">{dict.error}</p>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={formState === 'loading' || !nombre.trim() || !texto.trim()}
                    className="w-full bg-[#C5A059] text-white py-4 rounded-lg font-bold text-xs uppercase tracking-[0.2em] hover:bg-amber-600 transition shadow-lg disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {formState === 'loading' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        {dict.sending}
                      </>
                    ) : dict.submit}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
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
                  onClick={handleClose}
                  className="px-10 py-3 rounded border border-slate-200 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:border-[#C5A059] hover:text-[#C5A059] transition"
                >
                  {dict.close}
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}
