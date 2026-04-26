'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// ─── Tipos ────────────────────────────────────────────────────
type Estado = 'pendiente' | 'aprobado' | 'rechazado'
type Tab    = 'pendiente' | 'aprobado' | 'rechazado'

type Testimonio = {
  id: number
  nombre: string
  estrellas: number
  texto: string
  estado: Estado
  created_at: string
}

// ─── Helpers ──────────────────────────────────────────────────
function getInitials(nombre: string): string {
  return nombre.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase() ?? '').join('')
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (diff < 1)   return 'Hace un momento'
  if (diff < 60)  return `Hace ${diff} min`
  if (diff < 1440) return `Hace ${Math.floor(diff / 60)}h`
  return `Hace ${Math.floor(diff / 1440)} días`
}

const BADGE: Record<Estado, string> = {
  pendiente: 'bg-amber-50 text-amber-600 border border-amber-200',
  aprobado:  'bg-emerald-50 text-emerald-600 border border-emerald-200',
  rechazado: 'bg-red-50 text-red-400 border border-red-200',
}

const LABEL: Record<Estado, string> = {
  pendiente: 'Pendiente',
  aprobado:  'Aprobado',
  rechazado: 'Rechazado',
}

// ─── Componente principal ─────────────────────────────────────
export default function AdminPage() {
  const router = useRouter()
  const [testimonios, setTestimonios] = useState<Testimonio[]>([])
  const [loading, setLoading]         = useState(true)
  const [tab, setTab]                 = useState<Tab>('pendiente')
  const [userEmail, setUserEmail]     = useState('')
  const [procesando, setProcesando]   = useState<number | null>(null)
  const [confirmEliminar, setConfirmEliminar] = useState<number | null>(null)

  // ── Cargar sesión y datos ──
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) setUserEmail(session.user.email)
      await fetchTestimonios()
    }
    init()
  }, [])

  async function fetchTestimonios() {
    setLoading(true)
    const { data } = await supabase
      .from('testimonios')
      .select('id, nombre, estrellas, texto, estado, created_at')
      .order('created_at', { ascending: false })

    if (data) setTestimonios(data)
    setLoading(false)
  }

  // ── Aprobar / Rechazar ──
  async function cambiarEstado(id: number, nuevoEstado: Estado) {
    setProcesando(id)
    await supabase
      .from('testimonios')
      .update({ estado: nuevoEstado })
      .eq('id', id)

    setTestimonios(prev =>
      prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t)
    )
    setProcesando(null)
  }

  // ── Eliminar testimonio ──
  async function eliminarTestimonio(id: number) {
    setProcesando(id)
    await supabase.from('testimonios').delete().eq('id', id)
    setTestimonios(prev => prev.filter(t => t.id !== id))
    setConfirmEliminar(null)
    setProcesando(null)
  }

  // ── Cerrar sesión ──
  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  // ── Conteos para estadísticas y tabs ──
  const conteo = {
    pendiente: testimonios.filter(t => t.estado === 'pendiente').length,
    aprobado:  testimonios.filter(t => t.estado === 'aprobado').length,
    rechazado: testimonios.filter(t => t.estado === 'rechazado').length,
  }

  const visibles = testimonios.filter(t => t.estado === tab)

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <header className="bg-[#0A192F] text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm tracking-wide">JOHANN DRIVER</span>
            <span className="text-slate-500 text-xs">—</span>
            <span className="text-slate-400 text-xs uppercase tracking-[0.15em]">Testimonios</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="/admin/reservas"
              className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-[#C5A059] transition flex items-center gap-2"
            >
              <i className="fa-solid fa-calendar-days text-xs" />
              Pre-Reservas
            </a>
            <span className="text-slate-400 text-xs hidden md:block">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-[#C5A059] transition flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-xs" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* ── Tarjetas de estadísticas ── */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {([ 'pendiente', 'aprobado', 'rechazado' ] as Tab[]).map((e) => (
            <div key={e} className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 block mb-2">
                {LABEL[e]}s
              </span>
              <span className={`text-4xl font-bold ${
                e === 'pendiente' ? 'text-[#C5A059]' :
                e === 'aprobado'  ? 'text-emerald-500' : 'text-red-400'
              }`}>
                {conteo[e]}
              </span>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-6">
          {([ 'pendiente', 'aprobado', 'rechazado' ] as Tab[]).map((e) => (
            <button
              key={e}
              onClick={() => setTab(e)}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-[0.1em] border transition ${
                tab === e
                  ? 'bg-[#0A192F] text-white border-[#0A192F]'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {LABEL[e]}s ({conteo[e]})
            </button>
          ))}
        </div>

        {/* ── Contenido ── */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-[#C5A059] rounded-full animate-spin" />
          </div>
        ) : visibles.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-16 text-center">
            <i className="fa-regular fa-comment-dots text-slate-200 text-4xl mb-4 block" />
            <p className="text-sm text-slate-400 font-light">
              No hay testimonios {LABEL[tab].toLowerCase()}s.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibles.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">

                  {/* Avatar + nombre + tiempo */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center font-bold text-sm">
                      {getInitials(t.nombre)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <p className="font-bold text-sm text-slate-800">{t.nombre}</p>
                        <span className="text-[10px] text-slate-400">{timeAgo(t.created_at)}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${BADGE[t.estado]}`}>
                          {LABEL[t.estado]}
                        </span>
                      </div>

                      {/* Estrellas */}
                      <div className="flex gap-0.5 mb-3">
                        {[...Array(t.estrellas)].map((_, j) => (
                          <i key={j} className="fa-solid fa-star text-[#C5A059] text-xs" />
                        ))}
                        {[...Array(5 - t.estrellas)].map((_, j) => (
                          <i key={j} className="fa-regular fa-star text-slate-300 text-xs" />
                        ))}
                      </div>

                      {/* Texto */}
                      <p className="text-sm font-light text-slate-600 leading-relaxed border-l-2 border-slate-100 pl-3">
                        "{t.texto}"
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {t.estado !== 'aprobado' && (
                      <button
                        onClick={() => cambiarEstado(t.id, 'aprobado')}
                        disabled={procesando === t.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider hover:bg-emerald-100 transition disabled:opacity-40"
                      >
                        {procesando === t.id
                          ? <div className="w-3 h-3 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
                          : <i className="fa-solid fa-check text-[10px]" />
                        }
                        Aprobar
                      </button>
                    )}
                    {t.estado !== 'rechazado' && (
                      <button
                        onClick={() => cambiarEstado(t.id, 'rechazado')}
                        disabled={procesando === t.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-400 text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition disabled:opacity-40"
                      >
                        {procesando === t.id
                          ? <div className="w-3 h-3 border-2 border-red-200 border-t-red-400 rounded-full animate-spin" />
                          : <i className="fa-solid fa-xmark text-[10px]" />
                        }
                        Rechazar
                      </button>
                    )}
                    {confirmEliminar === t.id ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => eliminarTestimonio(t.id)}
                          disabled={procesando === t.id}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-900 transition disabled:opacity-40"
                        >
                          {procesando === t.id
                            ? <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            : <i className="fa-solid fa-trash text-[10px]" />
                          }
                          Confirmar
                        </button>
                        <button
                          onClick={() => setConfirmEliminar(null)}
                          className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider hover:border-slate-300 transition"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmEliminar(t.id)}
                        disabled={procesando === t.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-400 text-xs font-bold uppercase tracking-wider hover:border-slate-300 hover:text-slate-600 transition disabled:opacity-40"
                      >
                        <i className="fa-solid fa-trash text-[10px]" />
                        Eliminar
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  )
}