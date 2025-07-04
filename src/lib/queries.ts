import { HeroSection } from "./types";

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function fetchHeroSection(): Promise<HeroSection | null> {
  if (!API_URL) {
    console.error("Missing API URL");
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/pages?slug=home`);

    if (!res.ok) {
      console.error("Failed to fetch homepage:", res.status, res.statusText);
      return null;
    }

    const text = await res.text();
    if (!text) {
      console.error("Empty response body from WordPress");
      return null;
    }

    const pages = JSON.parse(text);

    if (!Array.isArray(pages) || pages.length === 0) {
      console.warn("No pages found with slug=home");
      return null;
    }

    const acf = pages[0].acf;
    if (!acf || !acf.hero) {
      console.warn("ACF hero group missing from page data");
      return null;
    }

return {
  hero_title: acf.hero.hero_title,
  hero_subtitle: acf.hero.hero_subtitle,
  hero_button_primary: {
    text: acf.hero.hero_button_primary_text,
    url: acf.hero.hero_button_primary_url,
  },
  hero_button_secondary: {
    text: acf.hero.hero_button_secondary_text,
    url: acf.hero.hero_button_secondary_url,
  },
  hero_image_url: acf.hero.hero_image_url,
};

  } catch (error) {
    console.error("Error fetching hero section:", error);
    return null;
  }
}


