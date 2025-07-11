export async function addToWooCart(productId: number) {
  const res = await fetch("https://lf.sfgweb.co.za/wp-json/cocart/v2/cart/add-item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: String(productId),   // ✅ must be string
      quantity: "1",           // ✅ must be string
    }),
    credentials: "include",     // ✅ enables Woo session
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`WooCommerce error: ${error}`);
  }

  return res.json();
}
