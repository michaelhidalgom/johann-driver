import Image from 'next/image'

export default function MisionSection() {
  return (
    <section id="mision" className="pt-20 pb-32 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          <div className="relative">
            <Image
              src="/airport.jpg"
              alt="Atlanta Airport Service"
              width={800} height={600}
              className="rounded-xl shadow-xl relative z-10 w-full aspect-4/3 object-cover"
            />
            <div className="absolute -bottom-8 -right-8 bg-white border border-slate-100 p-8 rounded-xl shadow-xl z-20 hidden md:block">
              <span className="text-5xl font-bold text-[#C5A059] block mb-2 leading-none">24/7</span>
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-slate-500">Availability</span>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#C5A059] mb-4 block">Exclusive Driver</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-800 leading-tight">
              A service focused <br />on the <span className="text-[#C5A059]">details.</span>
            </h2>
            <div className="w-10 h-0.5 bg-[#C5A059] mb-10" />
            <div className="space-y-8 pl-6 border-l-2 border-slate-100">
              <div>
                <h3 className="text-sm uppercase font-bold tracking-widest text-slate-900 mb-2">Direct Service</h3>
                <p className="text-slate-500 font-light leading-relaxed text-sm">We don't work with random drivers. You deal directly with the owner, ensuring a consistent quality standard and always knowing who will pick you up.</p>
              </div>
              <div>
                <h3 className="text-sm uppercase font-bold tracking-widest text-slate-900 mb-2">Absolute Punctuality</h3>
                <p className="text-slate-500 font-light leading-relaxed text-sm">By managing an exclusive schedule, we plan every trip with generous safety margins to ensure zero delays to your flight or corporate meeting.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
