import type { Dictionary } from '@/lib/dictionary'

type Props = { dict: Dictionary['footer'] }

export default function Footer({ dict }: Props) {
  return (
    <footer className="bg-slate-100 pt-20 pb-10 border-t border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-14 border-b border-black/5 pb-14">

          <div className="col-span-1 md:col-span-2">
            <div className="mb-8">
              <span className="block text-xs font-bold tracking-[0.15em] uppercase gold-text mb-3">Johann Garcia Personal Driver LLC</span>
              <p className="text-sm text-slate-500 max-w-sm leading-relaxed font-light">
                {dict.tagline}
              </p>
            </div>
            <div className="flex gap-3">
              {['fa-brands fa-whatsapp', 'fa-brands fa-instagram'].map((icon) => (
                <a key={icon} href="#" className="w-9 h-9 rounded-md border border-slate-300 bg-white flex items-center justify-center text-slate-500 hover:border-[#C5A059] hover:text-[#C5A059] transition shadow-sm">
                  <i className={icon}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-7 text-xs">{dict.payment_title}</h5>
            <ul className="space-y-4">
              {[
                { icon: 'fa-solid fa-money-bill-1-wave', label: dict.cash },
                { icon: 'fa-solid fa-credit-card',       label: dict.card },
                { icon: 'fa-solid fa-mobile-screen-button', label: dict.zelle },
              ].map((p) => (
                <li key={p.label} className="flex items-center gap-3 text-slate-600 font-light text-sm">
                  <i className={`${p.icon} text-lg text-slate-400`}></i>
                  <span>{p.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-7 text-xs">{dict.contact_title}</h5>
            <ul className="space-y-4 text-sm text-slate-600 font-light">
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-location-dot text-sm text-slate-400"></i>Newnan, GA 30263
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-phone text-sm text-slate-400"></i>+1 (678) 907-2703
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-envelope text-sm text-slate-400"></i>
                <a href="mailto:jgpersonaldriver@gmail.com" className="hover:text-[#C5A059] transition">jgpersonaldriver@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-envelope text-sm text-slate-400"></i>
                <a href="mailto:johanngarcia@personaldriveratl.com" className="hover:text-[#C5A059] transition">johanngarcia@personaldriveratl.com</a>
              </li>
            </ul>
          </div>

        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-slate-400 text-[10px] uppercase tracking-[0.1em] font-bold gap-3">
          <span>{dict.copyright}</span>
          <span>{dict.motto}</span>
        </div>
      </div>
    </footer>
  )
}
