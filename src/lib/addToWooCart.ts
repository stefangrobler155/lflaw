export async function addToWooCart(productId: number) {
  const res = await fetch("https://lf.sfgweb.co.za/wp-json/cocart/v2/cart/add-item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // must be set to persist cart session
    body: JSON.stringify({
      id: String(productId), // must be string
      quantity: "1"
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`WooCommerce error: ${error}`);
  }

  const cartKey = res.headers.get("CoCart-API-Cart-Key");
  if (cartKey) {
    localStorage.setItem("cocart_key", cartKey);
  }

  return res.json();
}
