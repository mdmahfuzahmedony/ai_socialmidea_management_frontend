import Hero from '@/components/ui/home_page/Hero';
import LogoStrip from '@/components/ui/home_page/LogoStrip';
import Features from '@/components/ui/home_page/Features';
import Stats from '@/components/ui/home_page/Stats';
import Testimonials from '@/components/ui/home_page/Testimonials';
import CTASection from '@/components/ui/home_page/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <Features />
      <Stats />
      <Testimonials />
      <CTASection />
    </>
  );
}