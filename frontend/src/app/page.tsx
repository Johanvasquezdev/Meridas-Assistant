import { FAQ } from "@/components/FAQ";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { IndustryCarousel } from "@/components/IndustryCarousel";
import { Navbar } from "@/components/Navbar";
import { Pricing } from "@/components/Pricing";
import { Security } from "@/components/Security";
import { Stats } from "@/components/Stats";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#151417] text-[#F7F3EA] selection:bg-[#9E1B32]/40 selection:text-[#F7F3EA]">
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <IndustryCarousel />
      <Pricing />
      <Security />
      <FAQ />
      <Footer />
    </main>
  );
}
