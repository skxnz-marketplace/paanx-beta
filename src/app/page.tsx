import CategoryRail from "@/components/CategoryRail";
import ProductGrid from "@/components/ProductGrid";
import TrustStrip from "@/components/TrustStrip";
import { categories, products } from "@/data/products";

export default function Home() {
  const featured = products.filter((item) => !item.isRestricted).slice(0, 10);
  const restricted = products.filter((item) => item.isRestricted).slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
          Premium paan essentials
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-emerald-950 md:text-6xl">
          PAANX Beta
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
          A clean mobile-first catalog for paan kits, fresh leaves, mukhwas,
          ingredients, gifting, and age-restricted essentials.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md bg-[#f2f4ee] px-3 py-3">
            <strong className="block text-xl text-emerald-950">
              {products.length}
            </strong>
            <span className="text-xs font-semibold text-zinc-500">Items</span>
          </div>
          <div className="rounded-md bg-[#f2f4ee] px-3 py-3">
            <strong className="block text-xl text-emerald-950">
              {categories.length}
            </strong>
            <span className="text-xs font-semibold text-zinc-500">Categories</span>
          </div>
          <div className="rounded-md bg-[#f2f4ee] px-3 py-3">
            <strong className="block text-xl text-emerald-950">COD</strong>
            <span className="text-xs font-semibold text-zinc-500">UPI later</span>
          </div>
        </div>
      </section>

      <TrustStrip />

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Browse
            </p>
            <h2 className="text-xl font-bold text-zinc-950">Categories</h2>
          </div>
        </div>
        <CategoryRail />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-zinc-950">Featured Picks</h2>
        <ProductGrid products={featured} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-zinc-950">18+ Essentials</h2>
          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
            Age gate
          </span>
        </div>
        <ProductGrid products={restricted} />
      </section>
    </div>
  );
}
