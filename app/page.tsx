import HomePageCards from "@/components/landing-page-section-2/js/HomePageCards";
import LandingPage from "@/components/LandingPage";
import LandingPageCarousel from "@/components/landing-page/js/LandingPageCarousel";
import HomePageCarousel from "@/components/landing-page-section-2/js/HomePageCarousel";
import HomePageSlider from "@/components/landing-page-section-2/js/HomePageSlider";

export default function Home() {
  return (
    <>
      <LandingPage />
      <LandingPageCarousel />
      <HomePageCarousel />
      <HomePageCards />
      <HomePageSlider />
      {/* <Features />
      <GetApp /> */}
    </>
  );
}
