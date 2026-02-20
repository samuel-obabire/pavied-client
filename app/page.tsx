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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-[1300px] mx-auto">
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
