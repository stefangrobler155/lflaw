// src/components/CategoryFilter.tsx

"use client";

import Link from "next/link";
import { ProductCategory } from "@/lib/types";
import { usePathname } from "next/navigation";

type Props = {
  categories: ProductCategory[];
};

export default function CategoryFilter({ categories }: Props) {
  const pathname = usePathname();
  const activeSlug = pathname.split("/").pop(); // e.g. "family-law"

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-10">
      {/* Optional: "All" link */}
      <Link
        href="/contracts"
        className={`px-4 py-2 rounded border text-sm ${
          pathname === "/contracts" ? "bg-black text-white" : "bg-gray-100"
        }`}
      >
        All
      </Link>

      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/contracts/category/${cat.slug}`}
          className={`px-4 py-2 rounded border text-sm ${
            cat.slug === activeSlug ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
