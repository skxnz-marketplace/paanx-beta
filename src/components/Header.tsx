"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import SearchInput from "@/components/SearchInput";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-[#fbfcf8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link href="/" className="shrink-0">
          <span className="block text-xl font-black tracking-[0.18em] text-emerald-950">
            PAANX
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            beta v0.1
          </span>
        </Link>
        <div className="hidden flex-1 md:block">
          <SearchInput compact />
        </div>
        <nav className="ml-auto hidden items-center gap-5 text-sm font-semibold text-zinc-700 md:flex">
          <Link href="/search">Search</Link>
          <Link href="/legal">Legal</Link>
        </nav>
        <Link
          href="/cart"
          className="relative ml-auto flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-emerald-950 md:ml-0"
          aria-label="Cart"
        >
          <ShoppingBag size={18} aria-hidden />
          {itemCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-900 px-1 text-[11px] font-bold text-white">
              {itemCount}
            </span>
          ) : null}
        </Link>
      </div>
      <div className="px-4 pb-3 md:hidden">
        <SearchInput compact />
      </div>
    </header>
  );
}
