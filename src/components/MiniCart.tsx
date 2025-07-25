// src/components/MiniCart.tsx
"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaShoppingCart, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ScrollLockOverlay from "@/components/ScrollLockOverlay";

export default function MiniCart() {
  const { cart, loading, removeItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleDrawer = () => setIsOpen((prev) => !prev);

  // ⌨️ Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // 🔁 Auto-close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Trigger Button */}
      <button onClick={toggleDrawer} className="relative text-white">
        <FaShoppingCart size={24} />
        {cart && cart.items.length > 0 && (
          <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1.5 py-0.5">
            {cart.items.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* ScrollLockOverlay will handle body scrolling */}
            <ScrollLockOverlay active={true} />
            
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={toggleDrawer}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Drawer */}
            <motion.div
              key="cart-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold">Your Cart</h2>
                <button onClick={toggleDrawer}>
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-grow">
                {loading ? (
                  <p className="text-sm text-gray-500">Loading cart...</p>
                ) : !cart || cart.items.length === 0 ? (
                  <p className="text-sm text-gray-500">Your cart is empty.</p>
                ) : (
                  <ul className="space-y-4">
                    {cart.items.map((item) => (
                      <li
                        key={item.item_key}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity.value}
                          </p>
                        </div>
                        <div className="text-right">
                          <p>{item.totals.total}</p>
                          <button
                            onClick={() => removeItem(item.item_key)}
                            className="text-xs text-red-600 hover:underline"
                            disabled={loading}
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="p-4 border-t">
                <div className="flex justify-between mb-3">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">{cart?.totals.total || '0.00'}</span>
                </div>
                <Link
                  href={cart?.checkout_url || "https://lf.sfgweb.co.za/checkout"}
                  onClick={toggleDrawer}
                  className="block w-full text-center bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                >
                  Go to Checkout
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}