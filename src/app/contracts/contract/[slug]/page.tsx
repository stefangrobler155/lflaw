// src/app/contracts/contract/[slug]/page.tsx

import { fetchProductBySlug } from "@/lib/queries";
import { Product } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({
  params,
        }: {
          params: Promise<{ slug: string }>;
        }): Promise<Metadata> {
          const { slug } = await params;
          const product = await fetchProductBySlug(slug);

          if (!product) {
            return {
              title: "Contract Not Found – LF Attorneys",
              description: "The contract you're looking for doesn't exist.",
            };
          }

          return {
            title: `${product.name} – LF Attorneys`,
            description: product.description?.replace(/<[^>]+>/g, "").slice(0, 155) || "",
            openGraph: {
              title: `${product.name} – LF Attorneys`,
              description: product.description?.replace(/<[^>]+>/g, "").slice(0, 155) || "",
              images: product.images?.[0]?.src ? [{ url: product.images[0].src }] : [],
            },
          };
        }



export const segmentConfig = {
  dynamic: "force-dynamic",
};

export default async function ContractDetailPage({
// Must await params remember
params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product: Product | null = await fetchProductBySlug(slug);

  if (!product) return notFound();

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
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />

        <p className="text-gray-500 text-sm">R{product.price}</p>

        <div className="flex gap-4 mt-4">
          <button className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition">
            Add to Cart
          </button>
          <Link
            href="/contracts"
            className="px-5 py-2 border border-gray-500 rounded hover:bg-gray-100 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
