// src/lib/verifyWooOrder.ts

export async function verifyWooOrder(orderId: string, slug: string): Promise<boolean> {
  const base = process.env.WOOCOMMERCE_API_URL;
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  const res = await fetch(
    `${base}/orders/${orderId}?consumer_key=${key}&consumer_secret=${secret}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.error("Failed to fetch order:", await res.text());
    return false;
  }

  const order = await res.json();

  // ✅ Only allow completed or processing orders
  if (!["completed", "processing"].includes(order.status)) return false;

  // ✅ Check if any product in the order matches the current slug
  const hasMatchingProduct = order.line_items.some((item: any) => {
    return item.name.toLowerCase().includes(slug.replace(/-/g, " "));
  });

  return hasMatchingProduct;
}
