"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// --- Type Definitions ---
type WooCartItem = {
  id: number; // Product ID
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
  id: number;
  key: string;
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

// Function to determine if we should use the proxy
const useProxy = () => {
  // In development or when running locally, use the proxy
  return typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
     window.location.hostname === '127.0.0.1');
};

// Function to get the API URL (either direct or via proxy)
const getApiUrl = (endpoint: string) => {
  if (useProxy()) {
    // Use the proxy API route
    const encodedUrl = encodeURIComponent(`${NEXT_PUBLIC_WOOCOMMERCE_URL}${endpoint}`);
    return `/api/proxy?url=${encodedUrl}`;
  }
  // Use direct URL for production
  return `${NEXT_PUBLIC_WOOCOMMERCE_URL}${endpoint}`;
};

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
    // Check both possible header names
    const newCartKey = response.headers.get('x-cocart-cart-key') || response.headers.get('cocart-api-cart-key');
    
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Cart key from response:', newCartKey);
    
    // ✅ If a new key is found, store it for future requests
    if (newCartKey) {
      console.log('Storing cart key in localStorage:', newCartKey);
      localStorage.setItem(CART_KEY_LOCAL_STORAGE, newCartKey);
    }
  };
  /**
   * Fetches the current cart from CoCart and updates the local state.
   */
  const fetchCart = async () => {
    if (!loading) setLoading(true); // Set loading only if not already loading
    try {
      // Check if we're in a browser environment before making the fetch
      if (typeof window === 'undefined') {
        console.log('Skipping fetch in server-side rendering');
        return;
      }
      
      const apiUrl = getApiUrl('/wp-json/cocart/v2/cart');
      console.log('Fetching cart from:', apiUrl);
      console.log('With headers:', getApiHeaders());
      
      const response = await fetch(getApiUrl('/wp-json/cocart/v2/cart'), {
        headers: getApiHeaders(),
        credentials: "include", // persist cart session via cookies
      });
      
      handleResponseSession(response); // Check for a new cart key in the response headers
      
      // If the response is not ok, throw an error
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch cart data. Status: ${response.status}. Response: ${errorText}`);
      }
      
      const data: WooCart = await response.json();
      console.log('Cart data received:', data);
      setCart(data);
    } catch (error) {
      console.error("Fetch Cart Error:", error);
      // Don't crash the app, just set an empty cart
      setCart({
        id: 0,
        key: '',
        items: [],
        totals: {
          total: '0.00'
        },
        checkout_url: `${NEXT_PUBLIC_WOOCOMMERCE_URL}/checkout`
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch the cart when the provider first mounts (client-side only)
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      fetchCart();
    }
  }, []);

  /**
   * Adds an item to the cart.
   * 1. Sends the request to the CoCart API.
   * 2. Uses the API's response (the new cart state) to update the local state.
   */
  const addToCart = async (productId: number, quantity: number = 1) => {
    setLoading(true);
    try {
      // Check if we're in a browser environment before making the fetch
      if (typeof window === 'undefined') {
        console.log('Skipping addToCart in server-side rendering');
        return;
      }
      
      console.log('Adding to cart:', productId, 'quantity:', quantity);
      
      const response = await fetch(getApiUrl('/wp-json/cocart/v2/cart/add-item'), {
        method: 'POST',
        headers: getApiHeaders(),
        credentials: "include", // persist cart session via cookies
        body: JSON.stringify({
          id: String(productId), // CoCart expects string IDs
          quantity: String(quantity),
        }),
      });
      
      handleResponseSession(response);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add item to cart. Status: ${response.status}. Response: ${errorText}`);
      }
      
      const newCart: WooCart = await response.json();
      console.log('New cart after adding item:', newCart);
      setCart(newCart);
      alert("Added to cart!");
    } catch (error) {
      console.error("Add to Cart Error:", error);
      alert(error instanceof Error ? error.message : "An unknown error occurred.");
      // Refresh the cart to ensure it's in a consistent state
      fetchCart();
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
      // Check if we're in a browser environment before making the fetch
      if (typeof window === 'undefined') {
        console.log('Skipping updateItemQuantity in server-side rendering');
        return;
      }
      
      console.log('Updating quantity for item:', itemKey, 'to:', quantity);
      
      const response = await fetch(getApiUrl(`/wp-json/cocart/v2/cart/item/${itemKey}`), {
        method: 'POST',
        headers: getApiHeaders(),
        credentials: "include", // persist cart session via cookies
        body: JSON.stringify({ quantity }),
      });
      
      handleResponseSession(response);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update quantity. Status: ${response.status}. Response: ${errorText}`);
      }
      
      const newCart: WooCart = await response.json();
      console.log('New cart after updating quantity:', newCart);
      setCart(newCart);
    } catch (error) {
      console.error("Update Quantity Error:", error);
      // Refresh the cart to ensure it's in a consistent state
      fetchCart();
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
      // Check if we're in a browser environment before making the fetch
      if (typeof window === 'undefined') {
        console.log('Skipping removeItem in server-side rendering');
        return;
      }
      
      console.log('Removing item:', itemKey);
      
      const response = await fetch(getApiUrl(`/wp-json/cocart/v2/cart/item/${itemKey}`), {
        method: 'DELETE',
        headers: getApiHeaders(),
        credentials: "include", // persist cart session via cookies
      });
      
      handleResponseSession(response);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove item. Status: ${response.status}. Response: ${errorText}`);
      }
      
      const newCart: WooCart = await response.json();
      console.log('New cart after removing item:', newCart);
      setCart(newCart);
    } catch (error) {
      console.error("Remove Item Error:", error);
      // Refresh the cart to ensure it's in a consistent state
      fetchCart();
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