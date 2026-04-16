'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    // Si ya estamos en /admin/login no verificar sesión — evita el bucle infinito
    if (pathname === '/admin/login') {
      setVerificando(false)
      return
    }

    async function verificarSesion() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/admin/login')
      } else {
        setVerificando(false)
      }
    }
    verificarSesion()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== '/admin/login') {
        router.replace('/admin/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, pathname])

  if (verificando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#C5A059] rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}