"use client";

import { Product } from "@/lib/types";
import { useState } from "react";
import FreeDownloadModal from "@/components/FreeDownloadModal";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function AddToCartOrDownload({ product }: { product: Product }) {
  const isFree = Number(product.price) === 0;
  const downloadUrl = product.downloads?.[0]?.file;

  
  // This state will only be true for the specific button that was clicked.
  const [isAdding, setIsAdding] = useState(false);

  // This state will control the visibility of the modal for free downloads
  // It will be used to show the modal when the user clicks the download button for free
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Get the whole cart object and the addToCart function
  const { cart, addToCart } = useCart();

  // --- Solution for Issue 2: Check if item is in cart ---
  // We check if any item in the cart has an id that matches this product's id.
  // The ?. after cart handles the case where the cart is still loading (null).
  const isInCart = cart?.items.some((item) => item.id === product.id);
    const handleAddToCart = async () => {
    setIsAdding(true); // Start loading for this button only
    try {
      await addToCart(product.id);
      // The alert in the context is enough, no need for one here.
    } catch (error) {
      console.error("Failed to add to cart from component", error);
    } finally {
      setIsAdding(false); // Stop loading for this button
    }
  };

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

  if (isInCart) {
    return (
      <Link
        href="/cart"
        className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        View Cart
      </Link>
    );
  }
  // Otherwise, show the "Add to Cart" button
  return (
    <button
      onClick={handleAddToCart}
      // The button is disabled based on its own 'isAdding' state
      disabled={isAdding}
      className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}