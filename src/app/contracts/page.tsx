import { fetchAllProducts, fetchProductCategories } from "@/lib/queries";
import ContractsLanding from "@/components/ContractsLanding";
import { Product, ProductCategory } from "@/lib/types";

export default async function ContractsPage() {
  const [products, categories]: [Product[], ProductCategory[]] = await Promise.all([
    fetchAllProducts(),
    fetchProductCategories(),
  ]);

  return <ContractsLanding products={products} categories={categories} />;
}
