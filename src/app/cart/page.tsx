"use client";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, loading, removeItem, updateItemQuantity } = useCart();
  // Log the full cart object for debugging
  console.log("Full Cart Object:", cart);
  console.log("Loading state:", loading);
  
  // Log localStorage cart key for debugging
  if (typeof window !== 'undefined') {
    const cartKey = localStorage.getItem('cocart_cart_key');
    console.log("Cart key in localStorage:", cartKey);
  }
  // Show a loading message while fetching cart
  if (loading && !cart) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p>Loading Your Cart...</p>
      </main>
    );
  }

  // Show empty cart message
  if (!cart || cart.items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <p>Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {/* Cart Items List */}
      <ul className="space-y-4 mb-6">
        {cart.items.map((item) => (
          <li key={item.item_key} className="flex justify-between items-center border-b py-4">
            {/* ... item details, quantity input, remove button ... */}
            <div className="flex items-center gap-4">
                <img 
                    src={item.featured_image || '/placeholder.png'} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                />
                <div>
                    <p className="font-medium">{item.name}</p>
                    <input
                        type="number"
                        min="1"
                        value={item.quantity.value}
                        onChange={(e) => updateItemQuantity(item.item_key, parseInt(e.target.value))}
                        className="w-20 text-center border rounded mt-2"
                        disabled={loading}
                    />
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="font-semibold">{item.totals.total}</p>
              <button
                onClick={() => removeItem(item.item_key)}
                className="text-sm text-red-600 hover:underline"
                disabled={loading}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Totals Section */}
      <div className="mb-6 text-right font-bold text-xl">
        Total: {cart.totals.total}
      </div>

      {/* --- Checkout Button --- */}
      <div className="text-right">
        {/*
          We use a standard <a> tag because this is an external link
          that navigates away from your Next.js app to the WordPress backend.
        */}
        <a
          href={cart.checkout_url || 'https://lf.sfgweb.co.za/checkout'}
          className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition text-lg font-semibold"
        >
          Proceed to Checkout
        </a>
        <p className="text-sm text-gray-500 mt-2">You will be redirected to our secure checkout.</p>
      </div>
    </main>
  );
}