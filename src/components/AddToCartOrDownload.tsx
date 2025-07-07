"use client";

import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export default function AddToCartOrDownload({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const isFree = Number(product.price) === 0;
  const downloadUrl = product.downloads?.[0]?.file;

  if (isFree && downloadUrl) {
    return (
      <a
        href={downloadUrl}
        download
        className="bg-green-600 text-white px-5 py-2 rounded cursor-pointer hover:bg-green-700 transition"
      >
        Download Now
      </a>
    );
  }

  return (
    <button
      onClick={() =>{ 
        console.log("Adding to cart:", product);
        addToCart(product)
      }}
      className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition cursor-pointer"
    >
      Add to Cart
    </button>
  );
}
