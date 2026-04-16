'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin() {
    if (!email.trim() || !password.trim()) return
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Credenciales incorrectas. Intente nuevamente.')
      setLoading(false)
    } else {
      router.replace('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-sm p-10">

        {/* Cabecera */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#C5A059] block mb-2">
            Johann Driver
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Panel de Administración
          </p>
        </div>

        <div className="space-y-5">

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <i className="fa-solid fa-circle-exclamation text-red-400 text-xs" />
              <p className="text-xs text-red-500 font-medium">{error}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-[0.1em] text-slate-500 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="johann@johanndriver.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-[0.1em] text-slate-500 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
            />
          </div>

          {/* Botón */}
          <button
            onClick={handleLogin}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full bg-[#C5A059] text-white py-4 rounded-lg font-bold text-xs uppercase tracking-[0.2em] hover:bg-amber-600 transition shadow-lg disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Verificando...
              </>
            ) : (
              'Ingresar al Panel'
            )}
          </button>

        </div>

        <p className="text-center text-[10px] text-slate-400 mt-8 tracking-wide">
          Acceso restringido · Solo personal autorizado
        </p>

      </div>
    </div>
  )
}