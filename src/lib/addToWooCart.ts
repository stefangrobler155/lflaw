export async function addToWooCart(productId: number, quantity = 1) {
  const res = await fetch("https://lf.sfgweb.co.za/wp-json/cocart/v2/cart/add-item", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: `${productId}`,       // ✅ must be string
      quantity: `${quantity}`, // ✅ must also be string
    }),
  });

  if (!res.ok) {
    const message = await res.text();
    console.error("WooCommerce error:", message);
    throw new Error("Failed to add to WooCommerce cart");
  }

  return res.json();
}
