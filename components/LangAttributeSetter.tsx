'use client'
import { useEffect } from 'react'

export default function LangAttributeSetter({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  return null
}
