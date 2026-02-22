import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorksSection from "@/components/HowItWorksSection";
import Newsletter from "@/components/Newsletter";
import RatesSection from "@/components/RatesSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhySection from "@/components/WhySection";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-secondary/10 via-secondary/5 to-transparent" />
      <div className="pointer-events-none absolute -right-28 top-[28rem] -z-10 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      <Header />
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-[1300px]">
          <Hero />
          <WhySection />
          <HowItWorksSection />
          <ServicesSection />
          <RatesSection />
          <TestimonialsSection />
          <FaqSection />
        </div>
        <Newsletter />
        <Footer />
      </main>
    </div>
  );
}
