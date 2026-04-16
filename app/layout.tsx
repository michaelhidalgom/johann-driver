import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Johann Garcia Personal Driver LLC | Transporte Ejecutivo Premium',
  description: 'Puntualidad, discreción y confort garantizados en Atlanta, GA.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body className="text-slate-800 min-h-full flex flex-col">
        {children}
      </body>
{/*       <body className="text-slate-800 bg-white antialiased">
        {children}
      </body> */}
    </html>
  )
}