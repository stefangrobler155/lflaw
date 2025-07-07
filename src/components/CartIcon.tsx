"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FaShoppingCart } from "react-icons/fa";

export default function CartIcon() {
  const { items } = useCart();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <Link href="/cart" className="relative inline-block">
      <FaShoppingCart size={24} className="text-white" />
      <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1.5 py-0.5">
        {totalItems}
      </span>
    </Link>
  );
}
