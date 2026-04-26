import { getDictionary } from '@/lib/dictionary'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import MisionSection from '@/components/MisionSection'
import ReservasSection from '@/components/ReservasSection'
import TestimoniosSection from '@/components/TestimoniosSection'
import Footer from '@/components/Footer'

type Props = { params: Promise<{ lang: string }> }

export default async function Home({ params }: Props) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <>
      <Navbar dict={dict.navbar} lang={lang} />
      <HeroSection dict={dict.hero} />
      <MisionSection dict={dict.mision} />
      <ReservasSection dict={dict.reservas} />
      <TestimoniosSection dict={dict.testimonios} />
      <Footer dict={dict.footer} />
    </>
  )
}
