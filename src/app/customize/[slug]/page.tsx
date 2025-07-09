import { fetchProductBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";
import CustomizeForm from "@/components/CustomizeForm";

export default async function CustomizeContractPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params; 
  const product = await fetchProductBySlug(slug);
  if (!product) return notFound();

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
