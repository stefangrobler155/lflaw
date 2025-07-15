// src\lib\addToWooCart.ts
export async function addToWooCart(productId: number) {
  const cartKey = localStorage.getItem("cocart_key");

  const res = await fetch("https://lf.sfgweb.co.za/wp-json/cocart/v2/cart/add-item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cartKey && { "CoCart-API": cartKey })
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

  const newKey = res.headers.get("CoCart-API-Cart-Key");
  if (newKey) {
    localStorage.setItem("cocart_key", newKey);
  }

  return res.json();
}
