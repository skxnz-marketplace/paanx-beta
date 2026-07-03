import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { getCategoryBySlug } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";

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
      <section className="glass-royal relative overflow-hidden rounded-[4px] p-6 text-ivory md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-royal-500/25 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-300">
              Category
            </p>
            {category.isRestricted ? (
              <span className="rounded-full border border-gold-400/40 bg-gold-200/[0.05] px-2 py-0.5 text-xs font-bold text-gold-200">
                18+
              </span>
            ) : null}
          </div>
          <h1 className="font-display mt-2 text-4xl font-black tracking-tight text-ivory md:text-5xl">
            {category.name}
          </h1>
          <p className="mt-2 text-sm text-ivory/70">
            {categoryProducts.length} curated item
            {categoryProducts.length === 1 ? "" : "s"} available.
          </p>
        </div>
      </section>
      <ProductGrid products={categoryProducts} />
    </div>
  );
}
