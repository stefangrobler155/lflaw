// src/components/ProductCard.tsx
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  slug: string;
  images: { src: string; alt?: string }[];
  price: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="color-white border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      {product.images?.[0]?.src ? (
        <img
          src={product.images[0].src}
          alt={product.name}
          className="w-full h-50 aspect-square object-scale-down hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm text-gray-500">
          No image
        </div>
      )}

      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-4">R{product.price}</p>

        <Link
          href={`/product/${product.slug}`}
          className="inline-block px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
