export type HeroButton = {
  text: string;
  url: string;
};

export type HeroSection = {
  hero_title: string;
  hero_subtitle: string;
  hero_button_primary: HeroButton;
  hero_button_secondary: HeroButton;
  hero_image_url: string;
};

// src/lib/types.ts
export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  image?: {
    src: string;
    alt?: string;
  };
};
