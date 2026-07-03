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
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white px-2 py-2 md:hidden">
      <div className="grid grid-cols-4">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-1 rounded-md py-1.5 text-[11px] font-semibold ${
                active ? "text-emerald-950" : "text-zinc-500"
              }`}
            >
              <Icon size={19} aria-hidden />
              <span>{label}</span>
              {href === "/cart" && itemCount > 0 ? (
                <span className="absolute right-5 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-900 px-1 text-[10px] text-white">
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
