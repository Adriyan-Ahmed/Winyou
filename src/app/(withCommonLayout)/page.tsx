import CallToActionSection from "@/components/home/CallToActionSection";
import HeroSection from "@/components/home/HeroSection";
import HomeProduct from "@/components/home/HomeProduct";
import Testimonials from "@/components/home/Testimonials";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full py-4">
        <HeroSection />
        <HomeProduct />
        <WhyChooseUs />
        <Testimonials />
        <CallToActionSection />
      </div>
    </div>
  );
}
