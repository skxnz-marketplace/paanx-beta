"use client";

import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/CartProvider";

export default function ProductPurchase({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className="mt-auto flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-900 px-5 text-sm font-bold text-white transition hover:bg-emerald-950 md:max-w-xs"
    >
      <Plus size={18} aria-hidden />
      Add to cart
    </button>
  );
}
