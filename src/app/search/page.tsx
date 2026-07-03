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
      <section className="rounded-[4px] border border-gold-200/10 glass p-5 md:p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-500">
          Search
        </p>
        <h1 className="font-display mt-1.5 text-4xl font-black tracking-tight text-gold-100">
          Find your PAANX picks
        </h1>
        <div className="mt-4">
          <SearchInput />
        </div>
        <p className="mt-3 text-sm font-medium text-gold-200/65">
          {results.length} result{results.length === 1 ? "" : "s"}
          {q ? ` for "${q}"` : " across the catalog"}.
        </p>
      </section>
      <ProductGrid products={results} />
    </div>
  );
}
