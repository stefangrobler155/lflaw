// src/app/contracts/category/[slug]/page.tsx

import { fetchProductsByCategorySlug, fetchProductCategories } from "@/lib/queries";
import { Product, ProductCategory } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";

export const segmentConfig = {
  dynamic: "force-dynamic",
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [products, categories]: [Product[], ProductCategory[]] = await Promise.all([
    fetchProductsByCategorySlug(slug),
    fetchProductCategories(),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-10 capitalize text-center">
        {slug.replace(/-/g, " ")} Contracts
      </h1>

      <CategoryFilter categories={categories} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
