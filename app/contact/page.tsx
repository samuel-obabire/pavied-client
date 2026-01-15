import ContactSection from "@/components/ContactSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Newsletter from "@/components/Newsletter";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with the Pavied team for any assistance or inquiries.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full">
        
        <div className="max-w-[1300px] mx-auto">
            <ContactSection />
          <FaqSection />
        </div>
        <Newsletter />
        <Footer />
      </main>
    </div>
  );
}
