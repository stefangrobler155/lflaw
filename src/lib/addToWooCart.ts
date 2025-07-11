// src/lib/addToWooCart.ts
export async function addToWooCart(productId: number, quantity = 1) {
  const res = await fetch("https://lf.sfgweb.co.za/wp-json/cocart/v2/cart/add-item", {
    method: "POST",
    credentials: "include", // 🧠 required to persist the WooCommerce session
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: productId,
      quantity,
    }),
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Failed to add to WooCommerce cart");
  }

  return res.json();
}
