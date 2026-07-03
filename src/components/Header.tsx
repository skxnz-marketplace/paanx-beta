"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import PaanxLogo from "@/components/brand/PaanxLogo";
import { useCart } from "@/components/CartProvider";
import SearchInput from "@/components/SearchInput";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40">
      {/* iOS frosted nav bar */}
      <div className="border-b border-gold-200/10 bg-carbon/80 backdrop-blur-lg backdrop-saturate-150">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3.5">
          <Link
            href="/"
            aria-label="PAANX home"
            className="group shrink-0 leading-none transition-opacity hover:opacity-90"
          >
            {/* desktop: emblem + wordmark */}
            <PaanxLogo variant="full" priority className="hidden md:inline-flex" />
            {/* mobile: compact emblem only */}
            <PaanxLogo
              variant="compact"
              priority
              className="md:hidden"
            />
            <span className="mt-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-gold-500">
              <span className="h-px w-4 bg-gold-500/60" />
              Delhi NCR · Beta
            </span>
          </Link>
          <div className="hidden flex-1 md:block">
            <SearchInput compact />
          </div>
          <nav className="ml-auto hidden items-center gap-7 text-[13px] font-semibold uppercase tracking-[0.14em] text-gold-200/75 md:flex">
            <Link href="/search" className="transition hover:text-gold-100">
              Search
            </Link>
            <Link href="/legal" className="transition hover:text-gold-100">
              Legal
            </Link>
          </nav>
          <Link
            href="/cart"
            className="relative ml-auto flex h-11 w-11 items-center justify-center rounded-[4px] border border-gold-200/15 bg-gold-200/[0.06] text-gold-100 backdrop-blur transition hover:border-gold-500/60 hover:bg-gold-200/10 md:ml-0"
            aria-label="Cart"
          >
            <ShoppingBag size={18} aria-hidden />
            {itemCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-royal-700 px-1 text-[11px] font-bold text-gold-100 ring-2 ring-carbon">
                {itemCount}
              </span>
            ) : null}
          </Link>
        </div>
        <div className="px-4 pb-3 md:hidden">
          <SearchInput compact />
        </div>
      </div>
    </header>
  );
}
