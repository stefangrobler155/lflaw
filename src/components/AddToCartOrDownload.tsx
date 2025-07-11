"use client";

import { Product } from "@/lib/types";
import { useState } from "react";
import FreeDownloadModal from "@/components/FreeDownloadModal";
import { useRouter } from "next/navigation";
import { addToWooCart } from "@/lib/addToWooCart";
import { useCart } from "@/context/CartContext";

export default function AddToCartOrDownload({ product }: { product: Product }) {
  const isFree = Number(product.price) === 0;
  const downloadUrl = product.downloads?.[0]?.file;

  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart(); // ✅ hook into local cart context

  const handleFreeSubmit = ({ name, email }: { name: string; email: string }) => {
    const query = new URLSearchParams({ name, email });
    router.push(`/customize/${product.slug}?${query.toString()}`);
  };

  if (isFree && downloadUrl) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Download Now
        </button>
        <FreeDownloadModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleFreeSubmit}
        />
      </>
    );
  }

  return (
    <button
      onClick={async () => {
        try {
          await addToWooCart(product.id); // ✅ WooCommerce cart
          addToCart(product);             // ✅ Frontend cart
          alert("Added to WooCommerce cart!");
        } catch (error) {
          console.error(error);
          alert("Failed to add to cart.");
        }
      }}
      className="bg-black text-white px-4 py-2 rounded"
    >
      Add to Cart
    </button>
  );
}
