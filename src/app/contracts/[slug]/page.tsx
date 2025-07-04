// src/app/contracts/[slug]/page.tsx

export const dynamic = "force-dynamic"; // ensure dynamic fetching

import { fetchProductsByCategorySlug } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";

export default async function ContractCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ✅ await first

  const products = await fetchProductsByCategorySlug(slug);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-10 capitalize">
        {slug.replace("-", " ")} Contracts
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
