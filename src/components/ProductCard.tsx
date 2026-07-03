"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/CartProvider";
import PriceBadge from "@/components/PriceBadge";
import ProductImage from "@/components/ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-900/30 hover:shadow-md">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="aspect-square overflow-hidden">
          <ProductImage product={product} />
        </div>
        <div className="space-y-2 p-3">
          <div className="min-h-16">
            <div className="flex items-center gap-2">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                {product.brand}
              </p>
              {product.isRestricted ? (
                <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                  18+
                </span>
              ) : null}
            </div>
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-zinc-950">
              {product.name}
            </h3>
            <p className="mt-1 text-xs text-zinc-500">{product.packSize}</p>
          </div>
          <PriceBadge price={product.price} mrp={product.mrp} />
        </div>
      </Link>
      <div className="px-3 pb-3">
        <button
          type="button"
          disabled={product.stock === "out_of_stock"}
          onClick={() => addItem(product)}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-emerald-900 text-sm font-semibold text-white transition hover:bg-emerald-950 disabled:bg-zinc-200 disabled:text-zinc-500"
        >
          <Plus size={16} aria-hidden />
          Add
        </button>
      </div>
    </article>
  );
}
