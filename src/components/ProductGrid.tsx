import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
