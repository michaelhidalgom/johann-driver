'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// ─── Tipos ────────────────────────────────────────────────────
type Estado = 'pendiente' | 'aceptada' | 'rechazada'

type Prereserva = {
  id: number
  created_at: string
  origen: string
  destino: string
  fecha: string   // 'YYYY-MM-DD'
  hora: string    // 'HH:MM'
  telefono: string
  correo: string
  estado: Estado
}

// ─── Helpers ──────────────────────────────────────────────────
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DIAS  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

const BADGE: Record<Estado, string> = {
  pendiente: 'bg-amber-50 text-amber-600 border border-amber-200',
  aceptada:  'bg-emerald-50 text-emerald-600 border border-emerald-200',
  rechazada: 'bg-red-50 text-red-400 border border-red-200',
}
const LABEL: Record<Estado, string> = {
  pendiente: 'Pendiente',
  aceptada:  'Aceptada',
  rechazada: 'Rechazada',
}
const DOT: Record<Estado, string> = {
  pendiente: 'bg-amber-400',
  aceptada:  'bg-emerald-400',
  rechazada: 'bg-red-400',
}

function formatHora(hora: string) {
  const [h, m] = hora.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
}

// ─── Componente principal ─────────────────────────────────────
export default function AdminReservasPage() {
  const router = useRouter()

  const hoy   = new Date()
  const [anio, setAnio]   = useState(hoy.getFullYear())
  const [mes,  setMes]    = useState(hoy.getMonth())       // 0-11
  const [prereservas, setPrereservas] = useState<Prereserva[]>([])
  const [loading,     setLoading]     = useState(true)
  const [seleccionada, setSeleccionada] = useState<Prereserva | null>(null)
  const [procesando,   setProcesando]   = useState(false)
  const [userEmail,    setUserEmail]    = useState('')

  // ── Cargar datos ──
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) setUserEmail(session.user.email)
      await fetchPrereservas()
    }
    init()
  }, [])

  async function fetchPrereservas() {
    setLoading(true)
    const { data } = await supabase
      .from('prereservas')
      .select('*')
      .order('fecha', { ascending: true })
      .order('hora',  { ascending: true })
    if (data) setPrereservas(data)
    setLoading(false)
  }

  // ── Cambiar estado ──
  async function cambiarEstado(id: number, nuevoEstado: Estado) {
    setProcesando(true)
    await supabase.from('prereservas').update({ estado: nuevoEstado }).eq('id', id)
    setPrereservas(prev =>
      prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p)
    )
    setSeleccionada(prev => prev?.id === id ? { ...prev, estado: nuevoEstado } : prev)
    setProcesando(false)
  }

  // ── Cerrar sesión ──
  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  // ── Navegación de mes ──
  function mesAnterior() {
    if (mes === 0) { setMes(11); setAnio(a => a - 1) }
    else setMes(m => m - 1)
  }
  function mesSiguiente() {
    if (mes === 11) { setMes(0); setAnio(a => a + 1) }
    else setMes(m => m + 1)
  }

  // ── Construcción del calendario ──
  const primerDia    = new Date(anio, mes, 1).getDay()   // 0=Dom
  const diasEnMes    = new Date(anio, mes + 1, 0).getDate()
  const celdas       = primerDia + diasEnMes             // celdas totales
  const filasNeeded  = Math.ceil(celdas / 7)

  // Prereservas del mes actual indexadas por día
  const porDia: Record<number, Prereserva[]> = {}
  prereservas.forEach(p => {
    const d = new Date(p.fecha + 'T00:00:00')
    if (d.getFullYear() === anio && d.getMonth() === mes) {
      const day = d.getDate()
      if (!porDia[day]) porDia[day] = []
      porDia[day].push(p)
    }
  })

  // Conteos globales
  const conteo = {
    pendiente: prereservas.filter(p => p.estado === 'pendiente').length,
    aceptada:  prereservas.filter(p => p.estado === 'aceptada').length,
    rechazada: prereservas.filter(p => p.estado === 'rechazada').length,
  }

  const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <header className="bg-[#0A192F] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm tracking-wide">JOHANN DRIVER</span>
            <span className="text-slate-500 text-xs">—</span>
            <span className="text-slate-400 text-xs uppercase tracking-[0.15em]">Pre-Reservas</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/admin" className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-[#C5A059] transition flex items-center gap-2">
              <i className="fa-solid fa-comments text-xs" />
              Testimonios
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

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Tarjetas de estadísticas ── */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {(['pendiente','aceptada','rechazada'] as Estado[]).map(e => (
            <div key={e} className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 block mb-2">
                {LABEL[e]}s
              </span>
              <span className={`text-4xl font-bold ${
                e === 'pendiente' ? 'text-[#C5A059]' :
                e === 'aceptada'  ? 'text-emerald-500' : 'text-red-400'
              }`}>
                {conteo[e]}
              </span>
            </div>
          ))}
        </div>

        {/* ── Calendario ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Navegación del mes */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <button
              onClick={mesAnterior}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#C5A059] hover:text-[#C5A059] transition"
            >
              <i className="fa-solid fa-chevron-left text-xs" />
            </button>
            <h2 className="font-bold text-slate-800 text-lg">
              {MESES[mes]} {anio}
            </h2>
            <button
              onClick={mesSiguiente}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#C5A059] hover:text-[#C5A059] transition"
            >
              <i className="fa-solid fa-chevron-right text-xs" />
            </button>
          </div>

          {/* Cabecera días de la semana */}
          <div className="grid grid-cols-7 border-b border-slate-100">
            {DIAS.map(d => (
              <div key={d} className="py-3 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                {d}
              </div>
            ))}
          </div>

          {/* Grilla de días */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-[#C5A059] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {Array.from({ length: filasNeeded * 7 }).map((_, idx) => {
                const dia = idx - primerDia + 1
                const esValido  = dia >= 1 && dia <= diasEnMes
                const fechaCelda = `${anio}-${String(mes+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`
                const esHoy     = esValido && fechaCelda === hoyStr
                const reservas  = esValido ? (porDia[dia] ?? []) : []
                const MAX_DOTS  = 3

                return (
                  <div
                    key={idx}
                    className={`min-h-[100px] p-2 border-b border-r border-slate-100 ${
                      !esValido ? 'bg-slate-50/50' : 'hover:bg-slate-50 transition'
                    }`}
                  >
                    {esValido && (
                      <>
                        {/* Número del día */}
                        <div className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold mb-1 ${
                          esHoy
                            ? 'bg-[#C5A059] text-white'
                            : 'text-slate-600'
                        }`}>
                          {dia}
                        </div>

                        {/* Reservas del día */}
                        <div className="space-y-1">
                          {reservas.slice(0, MAX_DOTS).map(r => (
                            <button
                              key={r.id}
                              onClick={() => setSeleccionada(r)}
                              className="w-full text-left"
                            >
                              <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold truncate ${
                                r.estado === 'pendiente' ? 'bg-amber-50 text-amber-700' :
                                r.estado === 'aceptada'  ? 'bg-emerald-50 text-emerald-700' :
                                                           'bg-red-50 text-red-500'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT[r.estado]}`} />
                                {formatHora(r.hora)} · {r.origen.split(' ')[0]}
                              </div>
                            </button>
                          ))}
                          {reservas.length > MAX_DOTS && (
                            <p className="text-[10px] text-slate-400 pl-1">
                              +{reservas.length - MAX_DOTS} más
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Leyenda ── */}
        <div className="flex items-center gap-6 mt-4 px-1">
          {(['pendiente','aceptada','rechazada'] as Estado[]).map(e => (
            <div key={e} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${DOT[e]}`} />
              <span className="text-[11px] text-slate-400 font-medium">{LABEL[e]}</span>
            </div>
          ))}
        </div>

      </main>

      {/* ── Modal detalle de pre-reserva ── */}
      {seleccionada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(10,25,47,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSeleccionada(null) }}
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md p-10">

            {/* Cabecera modal */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#C5A059] mb-2 block">
                  Pre-Reserva #{seleccionada.id}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${BADGE[seleccionada.estado]}`}>
                  {LABEL[seleccionada.estado]}
                </span>
              </div>
              <button
                onClick={() => setSeleccionada(null)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-300 hover:text-slate-600 transition"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            {/* Detalle */}
            <div className="space-y-4 mb-8">
              {[
                { icon: 'fa-solid fa-location-dot',        label: 'Origen',   value: seleccionada.origen },
                { icon: 'fa-solid fa-flag-checkered',      label: 'Destino',  value: seleccionada.destino },
                { icon: 'fa-solid fa-calendar',            label: 'Fecha',    value: new Date(seleccionada.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) },
                { icon: 'fa-solid fa-clock',               label: 'Hora',     value: formatHora(seleccionada.hora) },
                { icon: 'fa-solid fa-phone',               label: 'Teléfono', value: seleccionada.telefono },
                { icon: 'fa-solid fa-envelope',            label: 'Correo',   value: seleccionada.correo },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center text-[#C5A059] shrink-0">
                    <i className={`${item.icon} text-xs`} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-[0.1em] text-slate-400 mb-0.5">{item.label}</p>
                    <p className="text-sm text-slate-700 font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-6 border-t border-slate-100">
              {seleccionada.estado !== 'aceptada' && (
                <button
                  onClick={() => cambiarEstado(seleccionada.id, 'aceptada')}
                  disabled={procesando}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider hover:bg-emerald-100 transition disabled:opacity-40"
                >
                  {procesando
                    ? <div className="w-3 h-3 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
                    : <i className="fa-solid fa-check text-[10px]" />
                  }
                  Aceptar
                </button>
              )}
              {seleccionada.estado !== 'rechazada' && (
                <button
                  onClick={() => cambiarEstado(seleccionada.id, 'rechazada')}
                  disabled={procesando}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-red-200 bg-red-50 text-red-400 text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition disabled:opacity-40"
                >
                  {procesando
                    ? <div className="w-3 h-3 border-2 border-red-200 border-t-red-400 rounded-full animate-spin" />
                    : <i className="fa-solid fa-xmark text-[10px]" />
                  }
                  Rechazar
                </button>
              )}
              <button
                onClick={() => setSeleccionada(null)}
                className="px-5 py-3 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider hover:border-slate-300 transition"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}