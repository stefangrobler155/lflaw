"use client";


import { Product, ProductCategory } from "@/lib/types";
import ProductCard from "./ProductCard";
import CategoryFilter from "@/components/CategoryFilter";

type Props = {
  products: Product[];
  categories: ProductCategory[];
};

export default function ContractsLanding({ products, categories }: Props) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">All Contracts</h1>
      

      {/* Filter Buttons */}
       <CategoryFilter categories={categories} />

      {/* Product Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
