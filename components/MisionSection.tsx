import Image from 'next/image'

export default function MisionSection() {
  return (
    // Modificación en la línea 5 de MisionSection.tsx
<section id="mision" className="pt-20 pb-32 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          <div className="relative">
            <Image
              src="/airport.jpg"
              alt="Atlanta Airport Service"
              width={800} height={600}
              className="rounded-xl shadow-xl relative z-10 w-full aspect-[4/3] object-cover"
            />
            <div className="absolute -bottom-8 -right-8 bg-white border border-slate-100 p-8 rounded-xl shadow-xl z-20 hidden md:block">
              <span className="text-5xl font-bold text-[#C5A059] block mb-2 leading-none">24/7</span>
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-slate-500">Disponibilidad</span>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#C5A059] mb-4 block">Conductor Exclusivo</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-800 leading-tight">
              Un servicio enfocado <br />en el <span className="text-[#C5A059]">detalle.</span>
            </h2>
            <div className="w-10 h-[2px] bg-[#C5A059] mb-10" />
            <div className="space-y-8 pl-6 border-l-2 border-slate-100">
              <div>
                <h3 className="text-sm uppercase font-bold tracking-[0.1em] text-slate-900 mb-2">Trato Directo</h3>
                <p className="text-slate-500 font-light leading-relaxed text-sm">No trabajamos con choferes aleatorios. Usted trata directamente con el propietario, garantizando un estándar de calidad invariable y sabiendo siempre quién lo recogerá.</p>
              </div>
              <div>
                <h3 className="text-sm uppercase font-bold tracking-[0.1em] text-slate-900 mb-2">Puntualidad Absoluta</h3>
                <p className="text-slate-500 font-light leading-relaxed text-sm">Al manejar una agenda exclusiva, programamos cada viaje con amplios márgenes de seguridad para asegurar cero demoras hacia su vuelo o reunión corporativa.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}