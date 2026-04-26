import { NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'es']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) return NextResponse.next()

  const hasLocale = locales.some(
    loc => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  )
  if (hasLocale) return NextResponse.next()

  const acceptLang = request.headers.get('accept-language') ?? ''
  const preferred = acceptLang.split(',')[0].split('-')[0].toLowerCase()
  const locale = locales.includes(preferred) ? preferred : defaultLocale

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)'],
}
