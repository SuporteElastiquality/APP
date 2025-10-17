import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import ServiceCategories from '@/components/ServiceCategories'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import Stats from '@/components/Stats'
import CTA from '@/components/CTA'
import TestMobileLinks from '@/components/TestMobileLinks'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <TestMobileLinks />
        <Hero />
        <Stats />
        <ServiceCategories />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      
      <Footer />
    </div>
  )
}
