"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCart();

  const total = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4 mb-6">
            {items.map((item) => (
              <li key={item.product.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p>R{Number(item.product.price) * item.quantity}</p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mb-6 text-right font-bold">Total: R{total.toFixed(2)}</div>

          <Link
            href="https://lf.sfgweb.co.za/checkout"
            className="bg-black text-white px-5 py-3 rounded hover:bg-gray-800 transition"
          >
            Proceed to Checkout
          </Link>
        </>
      )}
    </main>
  );
}