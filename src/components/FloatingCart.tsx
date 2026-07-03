"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

export default function FloatingCart() {
  const { itemCount, subtotal } = useCart();

  if (itemCount === 0) return null;

  return (
    <Link
      href="/cart"
      className="glass-royal animate-rise fixed bottom-24 left-4 right-4 z-30 flex items-center justify-between rounded-[4px] px-4 py-3.5 text-gold-100 md:bottom-6 md:left-auto md:right-6 md:w-80"
    >
      <span className="flex items-center gap-2.5 text-sm font-semibold">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-200/10 text-gold-200 ring-1 ring-gold-500/30">
          <ShoppingBag size={16} aria-hidden />
        </span>
        {itemCount} item{itemCount > 1 ? "s" : ""}
      </span>
      <span className="flex items-center gap-2 text-sm font-black tabular-nums text-gold-200">
        {formatPrice(subtotal)}
        <ArrowRight size={16} aria-hidden className="text-gold-400" />
      </span>
    </Link>
  );
}
