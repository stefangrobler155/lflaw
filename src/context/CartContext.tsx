"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { getWooCart } from "@/lib/getWooCart";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  syncCartWithWoo: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  // ✅ Pull from Woo backend on mount
  const syncCartWithWoo = async () => {
    try {
      const data = await getWooCart();
      const syncedItems: CartItem[] = data.items.map((wooItem: any) => ({
        product: {
          id: wooItem.id,
          name: wooItem.name,
          price: wooItem.price,
          slug: wooItem.slug,
          images: wooItem.images,
          downloads: wooItem.downloads,
          categories: wooItem.categories,
        },
        quantity: wooItem.quantity,
      }));

      setItems(syncedItems);
    } catch (err) {
      console.warn("Could not sync with WooCommerce:", err);
    }
  };

  const trySyncWooCart = async () => {
    const cartKey = localStorage.getItem("cocart_key");
    if (!cartKey) return;
    await syncCartWithWoo();
  };
  
  useEffect(() => {
    trySyncWooCart();
  }, []);
  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, syncCartWithWoo }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
