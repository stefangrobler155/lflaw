//export hero section type
// This type represents the hero section data structure in WordPress
// It includes the title, subtitle, buttons, and image URL
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

//export product category type
// This type represents a product category in WooCommerce
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

//export product type
// This type represents a product in WooCommerce
export type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  images: { src: string; alt?: string }[];
  categories: { id: number; name: string; slug: string }[];
};
