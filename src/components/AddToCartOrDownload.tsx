"use client";

import { Product } from "@/lib/types";
import { useState } from "react";
import FreeDownloadModal from "@/components/FreeDownloadModal";
import { useRouter } from "next/navigation";

export default function AddToCartOrDownload({ product }: { product: Product }) {
  const isFree = Number(product.price) === 0;
  const downloadUrl = product.downloads?.[0]?.file;

  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // ✅ For free contracts
  const handleFreeSubmit = ({ name, email }: { name: string; email: string }) => {
    const query = new URLSearchParams({ name, email });
    router.push(`/customize/${product.slug}?${query.toString()}`);
  };

  // ✅ For paid contracts – hand off to Woo
  const handlePaidClick = () => {
    const wooAddToCartUrl = `https://lf.sfgweb.co.za/?add-to-cart=${product.id}`;
    router.push(wooAddToCartUrl);
  };

  // ✅ Free Product Flow
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

  // ✅ Paid Product Flow
  return (
    <button
      onClick={handlePaidClick}
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
    >
      Buy Now
    </button>
  );
}
