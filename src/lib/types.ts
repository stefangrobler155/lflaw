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
