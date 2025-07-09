import { fetchProductBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";
import CustomizeForm from "@/components/CustomizeForm";
import DynamicFormRenderer from "@/components/forms/DynamicFormRenderer";

export default async function CustomizeContractPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params
  const product = await fetchProductBySlug(slug);

  if (!product) return notFound();

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Customize: {product.name}</h1>
      {product.form_fields && product.form_fields.length > 0 ? (
        <CustomizeForm slug={slug} fields={product.form_fields} />
      ) : (
        <p className="text-gray-500">
          No customization fields found for this contract.
        </p>
      )}

    </main>
  );
}
