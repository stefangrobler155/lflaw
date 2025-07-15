"use client";

import { Product } from "@/lib/types";
import { useState } from "react";
import FreeDownloadModal from "@/components/FreeDownloadModal";
import { useRouter } from "next/navigation";
// We only need the useCart hook now!
import { useCart } from "@/context/CartContext";

export default function AddToCartOrDownload({ product }: { product: Product }) {
  const isFree = Number(product.price) === 0;
  const downloadUrl = product.downloads?.[0]?.file;

  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  // Get the addToCart function and loading state from our context
  const { addToCart, loading } = useCart();

  const handleFreeSubmit = ({ name, email }: { name: string; email: string }) => {
    const query = new URLSearchParams({ name, email });
    router.push(`/customize/${product.slug}?${query.toString()}`);
  };

  // This part for free products remains the same. No changes needed here.
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

  // --- This is the simplified part ---
  return (
    <button
      // The onClick handler is now much cleaner
      onClick={() => addToCart(product.id)}
      // Disable the button while the cart is being updated to prevent double-clicks
      disabled={loading}
      className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}