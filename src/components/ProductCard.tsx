"use client";

import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/CartProvider";
import PriceBadge from "@/components/PriceBadge";
import ProductImage from "@/components/ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock === "out_of_stock";
  const low = product.stock === "limited";

  function handleAdd() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1100);
  }

  return (
    <article className="group card-lift flex flex-col overflow-hidden rounded-[4px] border border-gold-200/10 glass">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative m-2 aspect-square overflow-hidden rounded-[4px] border border-gold-200/10 bg-black/20">
          <ProductImage product={product} />
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.isRestricted ? (
              <span className="rounded-full bg-carbon/70 px-2 py-0.5 text-[10px] font-bold text-gold-200 ring-1 ring-gold-500/40 backdrop-blur">
                18+
              </span>
            ) : null}
            {product.tags?.includes("bestseller") ? (
              <span className="rounded-full bg-gradient-to-b from-gold-200 to-gold-400 px-2 py-0.5 text-[10px] font-bold text-royal-900 ring-1 ring-gold-500/40 backdrop-blur">
                Bestseller
              </span>
            ) : null}
          </div>
          {soldOut ? (
            <span className="absolute right-2 top-2 rounded-full bg-carbon/80 px-2 py-0.5 text-[10px] font-bold text-gold-100 backdrop-blur">
              Sold out
            </span>
          ) : low ? (
            <span className="absolute right-2 top-2 rounded-full bg-royal-700/70 px-2 py-0.5 text-[10px] font-bold text-gold-100 ring-1 ring-gold-500/40 backdrop-blur">
              Limited
            </span>
          ) : null}
        </div>
        <div className="space-y-1.5 px-3.5 pt-1.5">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-gold-500">
            {product.brand}
          </p>
          <h3 className="font-display line-clamp-2 min-h-10 text-[15px] font-semibold leading-[1.2] text-gold-100">
            {product.name}
          </h3>
          <p className="text-[11px] text-gold-500/80">{product.packSize}</p>
          <div className="pt-0.5">
            <PriceBadge price={product.price} mrp={product.mrp} />
          </div>
        </div>
      </Link>
      <div className="mt-2.5 px-3.5 pb-3.5">
        <button
          type="button"
          disabled={soldOut}
          onClick={handleAdd}
          className={`btn-royal flex h-10 w-full items-center justify-center gap-1.5 rounded-[4px] text-[13px] font-bold uppercase tracking-[0.08em] ${
            added ? "!bg-none !bg-royal-600" : ""
          }`}
        >
          {added ? (
            <>
              <Check size={16} aria-hidden />
              Added
            </>
          ) : (
            <>
              <Plus size={16} aria-hidden />
              {soldOut ? "Sold out" : "Add"}
            </>
          )}
        </button>
      </div>
    </article>
  );
}
