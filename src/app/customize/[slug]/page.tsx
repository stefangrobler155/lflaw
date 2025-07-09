// ✅ Server Component
import CustomizeForm from "@/components/CustomizeForm";
import { fetchProductBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";


export default async function CustomizeContractPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ name?: string; email?: string; slug?: string }>;
}) {
    const { slug } = await params;
  
    const product = await fetchProductBySlug(slug);
    if (!product) return notFound();

    const { name: nameFromQuery = "", email: emailFromQuery = "" } = await searchParams;

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Customize: {product.name}</h1>

      
        <CustomizeForm
        nameFromQuery={nameFromQuery}
        emailFromQuery={emailFromQuery}
        />

    </main>
  );
}
