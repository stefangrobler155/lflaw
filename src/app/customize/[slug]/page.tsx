import { fetchProductBySlug } from "@/lib/queries";
import { verifyWooOrder } from "@/lib/verifyWooOrder";
import { notFound, redirect } from "next/navigation";
import CustomizeForm from "@/components/CustomizeForm";
import type { Metadata } from "next";

export default async function CustomizeContractPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { order?: string };
}) {
  const { slug } = await params; 


  const product = await fetchProductBySlug(slug);
  if (!product) return notFound();

    // 🛡️ If the product is paid, verify order
  const isPaid = Number(product.price) > 0;
  if (isPaid) {
    const orderId = searchParams.order;
    const verified = orderId ? await verifyWooOrder(orderId, slug) : false;
    if (!verified) {
      redirect("/unauthorized"); // or render a "not allowed" message
    }
  }

  const fields = product.form_fields || [];
  const templateUrl = product.downloads?.[0]?.file || "";
  

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Customize: {product.name}</h1>
      {fields.length > 0 && templateUrl ? (
        <CustomizeForm slug={product.slug} fields={fields} templateUrl={templateUrl} />
      ) : (
        <p className="text-gray-500">This contract cannot be customized.</p>
      )}
    </main>
  );
}
