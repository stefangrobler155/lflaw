// src/app/contracts/[slug]/page.tsx
import { fetchProductsByCategorySlug } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";

type Params = {
  slug: string;
};

export default async function ContractCategoryPage({ params }: { params: Params }) {
  const products = await fetchProductsByCategorySlug(params.slug);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-10 capitalize">
        {params.slug.replace("-", " ")} Contracts
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-600">No contracts available in this category.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
