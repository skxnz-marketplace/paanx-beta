"use client";

import Link from "next/link";
import { Home, Scale, Search, ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartProvider";

const items = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/search", label: "Search", Icon: Search },
  { href: "/cart", label: "Cart", Icon: ShoppingBag },
  { href: "/legal", label: "Legal", Icon: Scale },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-200/10 bg-carbon/85 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-lg backdrop-saturate-150 md:hidden">
      <div className="grid grid-cols-4">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-1 rounded-[4px] py-1.5 text-[11px] font-semibold transition ${
                active ? "text-gold-100" : "text-gold-500"
              }`}
            >
              <span
                className={`flex h-8 w-12 items-center justify-center rounded-full transition ${
                  active
                    ? "bg-royal-700/50 ring-1 ring-gold-500/40"
                    : "bg-transparent"
                }`}
              >
                <Icon size={19} aria-hidden />
              </span>
              <span>{label}</span>
              {href === "/cart" && itemCount > 0 ? (
                <span className="absolute right-4 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-royal-700 px-1 text-[10px] font-bold text-gold-100 ring-2 ring-carbon">
                  {itemCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
