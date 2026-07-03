import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { getCategoryBySlug, getProductsByCategory } from "@/data/products";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(slug);

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Category
          </p>
          {category.isRestricted ? (
            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
              18+
            </span>
          ) : null}
        </div>
        <h1 className="mt-2 text-3xl font-black text-emerald-950">
          {category.name}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {category.count} curated item{category.count > 1 ? "s" : ""} available.
        </p>
      </section>
      <ProductGrid products={categoryProducts} />
    </div>
  );
}
