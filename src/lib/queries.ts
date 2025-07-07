import { HeroSection, ProductCategory, Product } from "./types";

//Fetch Hero Section data from WordPress
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


// lib/queries.ts
//Fecth WooCommerce categories for the "Contracts" section
export async function fetchWooCategories() {
  const base = process.env.NEXT_PUBLIC_WC_BASE_URL;
  const key = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
  const secret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

  const res = await fetch(
    `${base}/wp-json/wc/v3/products/categories?per_page=10&parent=ID_OF_CONTRACTS`,
    {
      headers: {
        Authorization: 'Basic ' + btoa(`${key}:${secret}`),
      },
    }
  );

  if (!res.ok) {
    console.error(`[ WooCommerce API ] Failed:`, res.status);
    return [];
  }

  const data = await res.json();
  return data;
}

// src/lib/queries.ts


export async function fetchProductCategories(): Promise<ProductCategory[]> {
  const baseUrl = process.env.WOOCOMMERCE_API_URL;
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!baseUrl || !key || !secret) {
    console.error("Missing WooCommerce env variables");
    return [];
  }

  const url = `${baseUrl}/products/categories?consumer_key=${key}&consumer_secret=${secret}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    console.error("Failed to fetch categories:", res.statusText);
    return [];
  }

  const data: ProductCategory[] = await res.json();

  return data.filter((cat) => 
    cat.parent === 21 &&           // Only children of "Contracts"
    cat.slug !== "uncategorized"  // Exclude "Uncategorized"
  );
}

//Fetch products by category slug
// This function fetches products based on the category slug

export async function fetchProductsByCategorySlug(slug: string) {
  const base = process.env.WOOCOMMERCE_API_URL;
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  const categoryRes = await fetch(`${base}/products/categories?slug=${slug}&consumer_key=${key}&consumer_secret=${secret}`);
  const [category] = await categoryRes.json();

  if (!category?.id) return [];

  const productRes = await fetch(`${base}/products?category=${category.id}&consumer_key=${key}&consumer_secret=${secret}`);
  const data = await productRes.json();

  return data;
}


//fetch all products
// This function fetches all products from the WooCommerce API
export async function fetchAllProducts(): Promise<Product[]> {
  const base = process.env.WOOCOMMERCE_API_URL;
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  const res = await fetch(
    `${base}/products?per_page=100&consumer_key=${key}&consumer_secret=${secret}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.error("Failed to fetch all products");
    return [];
  }

  return res.json();
}

// Fetch product by slug
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const base = process.env.WOOCOMMERCE_API_URL;
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  const res = await fetch(
    `${base}/products?slug=${slug}&consumer_key=${key}&consumer_secret=${secret}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    console.error(`Failed to fetch product with slug "${slug}"`);
    return null;
  }
  const products: Product[] = await res.json();
  
  return products.length > 0 ? products[0] : null;
}

