// src\lib\addToWooCart.ts
export async function addToWooCart(productId: number) {
  const cartKey = localStorage.getItem("cocart_cart_key");

  const res = await fetch("https://lf.sfgweb.co.za/wp-json/cocart/v2/cart/add-item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cartKey && { "x-cocart-cart-key": cartKey })
    },
    credentials: "include", // persist cart session via cookies
    body: JSON.stringify({
      id: String(productId),
      quantity: "1"
    })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`WooCommerce error: ${error}`);
  }

  const newKey = res.headers.get("x-cocart-cart-key");
  if (newKey) {
    localStorage.setItem("cocart_cart_key", newKey);
  }

  return res.json();
}
