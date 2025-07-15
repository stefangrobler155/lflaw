
import AreasOfLawSection from "@/components/AreasOfLawSection";
import HeroSection from "@/components/HeroSection";
import { fetchHeroSection } from "@/lib/queries";
import { fetchProductCategories } from '@/lib/queries';

export default async function Home() {
  const hero = await fetchHeroSection();
  const categories = await fetchProductCategories();

  return (
    <div>
      <main className="">
        {hero && ( 
          <HeroSection
            title={hero.hero_title}
            subtitle={hero.hero_subtitle}
            primaryBtn={hero.hero_button_primary}
            secondaryBtn={hero.hero_button_secondary}
            imageUrl={hero.hero_image_url}             
             />
          )} 

          <AreasOfLawSection categories={categories} />
      </main>
    </div>
  );
}
