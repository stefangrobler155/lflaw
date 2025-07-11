export async function getWooCart() {
  const cartKey = localStorage.getItem("cocart_key");

  const res = await fetch("https://lf.sfgweb.co.za/wp-json/cocart/v2/cart", {
    headers: {
      "Content-Type": "application/json",
      ...(cartKey && { "CoCart-API": cartKey }),
    },
  });

  if (!res.ok) throw new Error("Failed to fetch WooCommerce cart");

  return res.json();
}
