import ProductGrid from "@/components/ProductGrid";
import SearchInput from "@/components/SearchInput";
import { searchProducts } from "@/lib/search";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = searchProducts(q);

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
          Search
        </p>
        <h1 className="mt-2 text-3xl font-black text-emerald-950">
          Find your PAANX picks
        </h1>
        <div className="mt-4">
          <SearchInput />
        </div>
        <p className="mt-3 text-sm text-zinc-600">
          {results.length} result{results.length === 1 ? "" : "s"}
          {q ? ` for "${q}"` : " across the catalog"}.
        </p>
      </section>
      <ProductGrid products={results} />
    </div>
  );
}
