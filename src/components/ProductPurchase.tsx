"use client";

import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/CartProvider";

export default function ProductPurchase({ product }: { product: Product }) {
  const { addItem } = useCart();

  const soldOut = product.stock === "out_of_stock";

  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() => addItem(product)}
      className="btn-royal mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[4px] px-5 text-sm font-bold uppercase tracking-[0.08em] md:max-w-xs"
    >
      <Plus size={18} aria-hidden />
      {soldOut ? "Sold out" : "Add to cart"}
    </button>
  );
}
