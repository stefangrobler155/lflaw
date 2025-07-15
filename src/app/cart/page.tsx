"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link"; // Can still be used for internal navigation

export default function CartPage() {
  // ✅ Get the full cart object, loading state, and new functions from the context
  const { cart, loading, removeItem, updateItemQuantity } = useCart();

  // Show a loading message while fetching the cart from the backend
  if (loading && !cart) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p>Loading Your Cart...</p>
      </main>
    );
  }

  // Show an empty cart message if there's no cart or it has no items
  if (!cart || cart.items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link href="/contracts" className="text-blue-600 hover:underline mt-4 inline-block">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {/* Cart Items List */}
      <ul className="space-y-4 mb-6">
        {cart.items.map((item) => (
          // ✅ Use item.item_key as the key, it's the unique ID from CoCart
          <li key={item.item_key} className="flex justify-between items-center border-b py-4">
            <div className="flex items-center gap-4">
                {/* Product Image */}
                <img 
                    src={item.featured_image || '/placeholder.png'} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                />
                <div>
                    <p className="font-medium">{item.name}</p>
                    {/* Input to update quantity */}
                    <input
                        type="number"
                        min="1"
                        // ✅ Use the quantity value from the cart item
                        value={item.quantity.value}
                        // ✅ Call updateItemQuantity when the value changes
                        onChange={(e) => updateItemQuantity(item.item_key, parseInt(e.target.value))}
                        className="w-20 text-center border rounded mt-2"
                        disabled={loading} // Disable while any cart operation is in progress
                    />
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {/* ✅ Use the formatted line total from the backend */}
              <p className="font-semibold">{item.totals.total}</p>
              <button
                // ✅ Call removeItem with the item's unique key
                onClick={() => removeItem(item.item_key)}
                className="text-sm text-red-600 hover:underline"
                disabled={loading} // Disable while loading
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Totals Section */}
      <div className="mb-6 text-right font-bold text-xl">
        {/* ✅ Use the fully formatted total from the backend */}
        Total: {cart.totals.total}
      </div>

      {/* Checkout Button */}
      <div className="text-right">
        {/* ✅ Use the dynamic checkout URL from the backend */}
        <a
          href={cart.checkout_url}
          className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition text-lg font-semibold"
        >
          Proceed to Checkout
        </a>
        <p className="text-sm text-gray-500 mt-2">You will be redirected to our secure checkout.</p>
      </div>
    </main>
  );
}