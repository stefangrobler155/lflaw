"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/types";
import { useState } from "react";
import FreeDownloadModal from "@/components/FreeDownloadModal";
import { useRouter } from "next/navigation";

export default function AddToCartOrDownload({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const isFree = Number(product.price) === 0;
  const downloadUrl = product.downloads?.[0]?.file;

  const [showModal, setShowModal] = useState(false);
  const router = useRouter();


const handleFreeSubmit = ({ name, email }: { name: string; email: string }) => {
  const query = new URLSearchParams({
    name,
    email,
  });

  router.push(`/customize/${product.slug}?${query.toString()}`);
};


  // const handleFreeSubmit = ({ name, email }: { name: string; email: string }) => {
  //   console.log("Free contract form submitted:", name, email);
  //   router.push(`/customize/${product.slug}`);
  //   // You could send this to your backend or tracking system

  //   if (downloadUrl) {
  //     // Force download
  //     const link = document.createElement("a");
  //     link.href = downloadUrl;
  //     link.download = "";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };

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
      onClick={() => addToCart(product)}
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
    >
      Add to Cart
    </button>
  );
}
