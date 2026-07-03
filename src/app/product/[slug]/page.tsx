import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import ProductGrid from "@/components/ProductGrid";
import ProductPurchase from "@/components/ProductPurchase";
import PriceBadge from "@/components/PriceBadge";
import { getProductBySlug, products } from "@/data/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="grid gap-5 rounded-lg border border-zinc-200 bg-white p-4 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:p-6">
        <div className="aspect-square overflow-hidden rounded-lg border border-zinc-100">
          <ProductImage product={product} />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/category/${product.category.toLowerCase().replace(/&/g, "and").replace(/\//g, " ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
              className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700"
            >
              {product.category}
            </Link>
            {product.isRestricted ? (
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
                18+
              </span>
            ) : null}
          </div>
          <h1 className="mt-3 text-3xl font-black leading-tight text-emerald-950 md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm font-semibold text-zinc-500">
            {product.brand} · {product.packSize}
          </p>
          <div className="mt-5">
            <PriceBadge price={product.price} mrp={product.mrp} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-md bg-[#f2f4ee] p-3">
              <span className="block text-xs font-semibold text-zinc-500">
                Stock
              </span>
              <strong className="text-emerald-950">
                {product.stock === "low_stock" ? "Low stock" : "In stock"}
              </strong>
            </div>
            <div className="rounded-md bg-[#f2f4ee] p-3">
              <span className="block text-xs font-semibold text-zinc-500">
                Price type
              </span>
              <strong className="capitalize text-emerald-950">
                {product.priceType}
              </strong>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-zinc-600">
            A PAANX beta catalog item with local sample data, ready for the final
            researched product file replacement.
          </p>
          <ProductPurchase product={product} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-zinc-950">More in {product.category}</h2>
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
