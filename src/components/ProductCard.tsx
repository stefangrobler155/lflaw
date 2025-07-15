// src\components\ProductCard.tsx

import Link from "next/link";
import { Product } from "@/lib/types";
import AddToCartOrDownload from "@/components/AddToCartOrDownload";

export default function ProductCard({ product }: { product: Product }) {
  const imageSrc = product.images?.[0]?.src || "";
  const imageAlt = product.images?.[0]?.alt || product.name;


  return (
    <div className="flex flex-row items-center gap-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition p-4 bg-white dark:bg-black">
      {/* Image Section */}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-24 h-24 object-cover rounded"
        />
      ) : (
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm text-gray-500 rounded">
          No image
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-col justify-between flex-grow">
        <div>
          <h3 className="light__text text-lg font-semibold mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">R{product.price}</p>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <AddToCartOrDownload product={product} />
          <Link
            href={`/contracts/contract/${product.slug}`}
            className="inline-block px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
