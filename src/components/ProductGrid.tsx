import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-[4px] border border-gold-200/10 glass p-10 text-center">
        <p className="text-sm font-semibold text-gold-100">No products found.</p>
        <p className="mt-1 text-xs text-gold-500">
          Try a different search or browse a category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {products.map((product, i) => (
        <Reveal key={product.id} as="div" pop delay={(i % 5) * 70}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}
