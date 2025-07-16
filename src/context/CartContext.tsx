"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// --- Type Definitions ---
type WooCartItem = {
  item_key: string;
  name: string;
  quantity: {
    value: number;
  };
  totals: {
    total: string;
  };
  featured_image: string;
  // Add any other item properties you need
};

// This is the shape of the cart data we expect back from the CoCart API
type WooCart = {
  items: WooCartItem[];
  totals: {
    total: string;
  };
  checkout_url: string;
};

// Define the context type
type CartContextType = {
  cart: WooCart | null;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateItemQuantity: (itemKey: string, quantity: number) => Promise<void>;
  removeItem: (itemKey: string) => Promise<void>;
  fetchCart: () => Promise<void>;
};

// The backend URL where your WordPress instance is hosted
const NEXT_PUBLIC_WOOCOMMERCE_URL = 'https://lf.sfgweb.co.za';
const CART_KEY_LOCAL_STORAGE = 'cocart_cart_key';

// Create the context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

// The provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<WooCart | null>(null);
  const [loading, setLoading] = useState(true);

    // This helper function builds the headers for each API request
  const getApiHeaders = () => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

  // Get the cart key from localStorage
  const cartKey = localStorage.getItem(CART_KEY_LOCAL_STORAGE);
  // ✅ Add the cart key to the request headers if it exists
  if (cartKey) {
    headers['x-cocart-cart-key'] = cartKey;
  }
  return headers;
};

  // This helper function checks the response for a new key and stores it
  const handleResponseSession = (response: Response) => {
    // ✅ After the request, check for a new key in the response headers
    const newCartKey = response.headers.get('x-cocart-cart-key');
    // ✅ If a new key is found, store it for future requests
    if (newCartKey) {
      localStorage.setItem(CART_KEY_LOCAL_STORAGE, newCartKey);
    }
  };
  /**
   * Fetches the current cart from CoCart and updates the local state.
   */
  const fetchCart = async () => {
    if (!loading) setLoading(true); // Set loading only if not already loading
    try {
      const response = await fetch(`${NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/cocart/v2/cart`, {
        headers: getApiHeaders(),
      });
      handleResponseSession(response); // Check for a new cart key in the response headers
      // If the response is not ok, throw an error
      if (!response.ok) throw new Error("Failed to fetch cart data.");
      const data: WooCart = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Fetch Cart Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the cart when the provider first mounts
  useEffect(() => {
    fetchCart();
  }, []);

  /**
   * Adds an item to the cart.
   * 1. Sends the request to the CoCart API.
   * 2. Uses the API's response (the new cart state) to update the local state.
   */
  const addToCart = async (productId: number, quantity: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/cocart/v2/cart/add-item`, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          id: String(productId), // CoCart expects string IDs
          quantity: String(quantity),
        }),
      });
      handleResponseSession(response);
      if (!response.ok) throw new Error("Failed to add item to cart.");
      const newCart: WooCart = await response.json();
      setCart(newCart);
      alert("Added to cart!");
    } catch (error) {
      console.error("Add to Cart Error:", error);
      alert(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Updates the quantity of a specific item in the cart.
   */
  const updateItemQuantity = async (itemKey: string, quantity: number) => {
    setLoading(true);
    try {
        const response = await fetch(`${NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/cocart/v2/cart/item/${itemKey}`, {
            method: 'POST',
            headers: getApiHeaders(),
            body: JSON.stringify({ quantity }),
        });
        handleResponseSession(response);
        if (!response.ok) throw new Error("Failed to update quantity.");
        const newCart: WooCart = await response.json();
        setCart(newCart);
    } catch (error) {
        console.error("Update Quantity Error:", error);
    } finally {
        setLoading(false);
    }
  };

  /**
   * Removes an item from the cart using its unique key.
   */
  const removeItem = async (itemKey: string) => {
    setLoading(true);
    try {
        const response = await fetch(`${NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/cocart/v2/cart/item/${itemKey}`, {
            method: 'DELETE',
            headers: getApiHeaders(),
        });
        handleResponseSession(response);
        if (!response.ok) throw new Error("Failed to remove item.");
        const newCart: WooCart = await response.json();
        setCart(newCart);
    } catch (error) {
        console.error("Remove Item Error:", error);
    } finally {
        setLoading(false);
    }
  };


 const value = { cart, loading, addToCart, updateItemQuantity, removeItem, fetchCart };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// --- Custom Hook ---
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};