"use client";

import React from "react";
import { ProductCategory } from "@/lib/types";
import Link from "next/link";

type Props = {
  categories: ProductCategory[];
};

const AreasOfLawSection: React.FC<Props> = ({ categories }) => {
  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-heading text-center mb-10">Areas of Law</h2>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="white__bg border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            {cat.image?.src ? (
              <img
                src={cat.image.src}
                alt={cat.name}
                className="w-full aspect-square h-100 object-cover"
              />
            ) : (
              <div className="w-full h-100 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                No image
              </div>
            )}

            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">{cat.name}</h3>
              {cat.description && (
                <p className="text-gray-600 text-sm mb-4">{cat.description}</p>
              )}
              <Link
                href={`/category/${cat.slug}`}
                className="inline-block mt-2 px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
              >
                View Contracts
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AreasOfLawSection;
