import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import MisionSection from '@/components/MisionSection'
import ReservasSection from '@/components/ReservasSection'
import TestimoniosSection from '@/components/TestimoniosSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <MisionSection />
      <ReservasSection />
      <TestimoniosSection />
      <Footer />
    </>
  )
}