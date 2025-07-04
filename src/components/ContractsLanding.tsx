"use client";

import { useState } from "react";
import { Product, ProductCategory } from "@/lib/types";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
  categories: ProductCategory[];
};

export default function ContractsLanding({ products, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? products.filter((product) =>
        product.categories?.some((cat) => cat.slug === activeCategory)
      )
    : products;

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">All Contracts</h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded border text-sm ${
            !activeCategory ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-4 py-2 rounded border text-sm ${
              activeCategory === cat.slug
                ? "bg-black text-white"
                : "bg-gray-100"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p>No contracts available.</p>
        ) : (
          filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </main>
  );
}
