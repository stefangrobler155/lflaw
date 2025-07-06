// src/app/contracts/contract/[slug]/page.tsx

import { fetchProductBySlug } from "@/lib/queries";
import { Product } from "@/lib/types";
import Link from "next/link";

type Props = {
  params: { slug: string };
};

export const dynamic = "force-dynamic"; // Ensure live data every request

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
    
  const product:  Product | null = await fetchProductBySlug(slug);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold">Contract not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
      {/* Image */}
      <div>
        {product.images[0] ? (
          <img
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            className="rounded shadow"
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div
          className="prose prose-sm dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
        <p className="text-gray-500 text-sm">R{product.price}</p>
        
        {/* back to all contacts */}
        <div className="flex gap-8">
            <button className="btn text-md">
                Add to Cart
            </button>
            <Link
                href="/contracts"
                className="btn text-md"
            >
                Continue Shopping
            </Link>
          </div>
      </div>
    </div>
  );
}
