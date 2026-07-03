"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

export default function FloatingCart() {
  const { itemCount, subtotal } = useCart();

  if (itemCount === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-20 left-4 right-4 z-30 flex items-center justify-between rounded-lg bg-emerald-950 px-4 py-3 text-white shadow-xl md:bottom-6 md:left-auto md:right-6 md:w-80"
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        <ShoppingBag size={17} aria-hidden />
        {itemCount} item{itemCount > 1 ? "s" : ""}
      </span>
      <span className="text-sm font-bold">{formatPrice(subtotal)}</span>
    </Link>
  );
}
