import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import ProductGrid from "@/components/ProductGrid";
import ProductPurchase from "@/components/ProductPurchase";
import PriceBadge from "@/components/PriceBadge";
import { getCategoryBySlug } from "@/data/categories";
import { getProductBySlug, products } from "@/data/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const category = getCategoryBySlug(product.category);

  const related = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 5);

  const priceTypeLabel =
    product.priceType === "source_mrp" ? "Verified MRP" : "Beta price";
  const stockLabel =
    product.stock === "out_of_stock"
      ? "Sold out"
      : product.stock === "limited"
        ? "Limited stock"
        : "In stock";

  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-[6px] border border-gold-200/10 glass p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:p-6 lg:gap-8">
        {/* cinematic image frame */}
        <div className="relative aspect-square overflow-hidden rounded-[5px] border border-gold-200/10 bg-gold-200/[0.05] shadow-[0_26px_60px_-30px_rgba(0,0,0,0.8)]">
          <ProductImage product={product} />
        </div>
        <div className="flex flex-col md:py-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/category/${product.category}`}
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-gold-300 transition hover:text-gold-100"
            >
              <span className="h-px w-4 bg-gold-400/70" />
              {category?.name ?? product.category}
            </Link>
            {product.isRestricted ? (
              <span className="rounded-full bg-royal-900 px-2 py-0.5 text-xs font-bold text-gold-200 ring-1 ring-gold-400/40">
                18+
              </span>
            ) : null}
          </div>
          <h1 className="font-display mt-3.5 text-[2rem] font-black leading-[1.05] tracking-tight text-gold-100 md:text-[3.25rem]">
            {product.name}
          </h1>
          <p className="mt-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-gold-200/55">
            {product.brand} · {product.packSize}
          </p>
          <div className="my-5 rule-gold" />
          <PriceBadge price={product.price} mrp={product.mrp} />
          <div className="mt-6 grid grid-cols-2 gap-2.5 text-sm">
            <div className="rounded-[4px] border border-gold-200/10 bg-gradient-to-b from-gold-200/[0.08] to-gold-200/[0.03] p-3.5">
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-gold-500">
                Availability
              </span>
              <strong className="mt-0.5 block text-gold-100">{stockLabel}</strong>
            </div>
            <div className="rounded-[4px] border border-gold-200/10 bg-gradient-to-b from-gold-200/[0.08] to-gold-200/[0.03] p-3.5">
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-gold-500">
                Pricing
              </span>
              <strong className="mt-0.5 block text-gold-100">
                {priceTypeLabel}
              </strong>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-gold-200/70">
            A PAANX beta catalog item with practical local pricing. Orders are
            confirmed over WhatsApp with age-aware checkout on restricted items.
          </p>
          <ProductPurchase product={product} />
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-gold-500">
            <span className="h-px w-5 bg-gold-400/70" />
            Keep exploring
          </p>
          <h2 className="font-display mt-1.5 text-2xl font-black tracking-tight text-gold-100 md:text-[28px]">
            More in {category?.name ?? product.category}
          </h2>
        </div>
        <ProductGrid products={related} />
      </section>
    </div>
  );
}

