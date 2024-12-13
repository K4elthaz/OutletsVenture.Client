import HomePageCards from "@/components/home-page/js/HomePageCards";
import HomePageCarousel from "@/components/home-page/js/HomePageCarousel";
import HomePageSlider from "@/components/home-page/js/HomePageSlider";

export default function Home() {
  return (
    <>
      <HomePageCarousel/>
      <HomePageCards />
      <HomePageSlider />
      {/* <Features />
      <GetApp /> */}
    </>
  )
}
