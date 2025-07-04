
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import { fetchHeroSection } from "@/lib/queries";


export default async function Home() {
  const hero = await fetchHeroSection();
  // console.log("Hero Section Data:", hero);

  return (
    <div>
      <main className="">
        <Navbar />
        {hero && ( 
          <HeroSection
            title={hero.hero_title}
            subtitle={hero.hero_subtitle}
            primaryBtn={hero.hero_button_primary}
            secondaryBtn={hero.hero_button_secondary}
            imageUrl={hero.hero_image_url}             
             />
          )}        
      </main>
    </div>
  );
}
