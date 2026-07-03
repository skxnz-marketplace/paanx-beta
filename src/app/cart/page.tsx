"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { lines, subtotal, hasRestrictedItem, updateQuantity, removeItem } =
    useCart();

  if (lines.length === 0) {
    return (
      <section className="rounded-[4px] border border-gold-200/10 glass p-10 text-center">
        <h1 className="font-display text-4xl font-black tracking-tight text-gold-100">
          Your cart is empty
        </h1>
        <p className="mt-3 text-sm text-gold-200/65">
          Add paan kits, ingredients, and essentials to begin an order.
        </p>
        <Link
          href="/"
          className="btn-royal mt-6 inline-flex h-11 items-center justify-center rounded-[4px] px-6 text-sm font-bold"
        >
          Shop PAANX
        </Link>
      </section>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="space-y-3">
        <h1 className="font-display text-4xl font-black tracking-tight text-gold-100">Cart</h1>
        {hasRestrictedItem ? (
          <div className="rounded-[4px] border border-gold-400/40 bg-royal-700/40 p-4 text-sm font-semibold text-gold-100">
            Your cart contains 18+ restricted items. Age confirmation may be
            required before delivery.
          </div>
        ) : null}
        <div className="space-y-3">
          {lines.map(({ product, quantity }) => (
            <article
              key={product.id}
              className="grid grid-cols-[88px_1fr] gap-3 rounded-[4px] border border-gold-200/10 glass p-3"
            >
              <div className="aspect-square overflow-hidden rounded-[4px] border border-gold-200/10 bg-gold-200/[0.05]">
                <ProductImage product={product} />
              </div>
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-500">
                      {product.brand}
                    </p>
                    <h2 className="mt-1 text-sm font-bold text-gold-100">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-xs text-gold-500">
                      {product.packSize}
                      {product.isRestricted ? " · 18+" : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-gold-200/12 bg-gold-200/[0.06] text-gold-300 transition hover:border-gold-500/50 hover:text-gold-100"
                    aria-label={`Remove ${product.name}`}
                  >
                    <Trash2 size={16} aria-hidden />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-[4px] border border-gold-200/12 bg-gold-200/[0.06]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={15} aria-hidden />
                    </button>
                    <span className="w-9 text-center text-sm font-bold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      <Plus size={15} aria-hidden />
                    </button>
                  </div>
                  <strong className="text-sm font-black text-gold-100 tabular-nums">
                    {formatPrice(product.price * quantity)}
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <aside className="h-fit rounded-[4px] border border-gold-200/10 glass p-5 lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-black tracking-tight text-gold-100">
          Order Summary
        </h2>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gold-200/65">Subtotal</span>
          <strong className="tabular-nums text-gold-100">
            {formatPrice(subtotal)}
          </strong>
        </div>
        <p className="mt-2 text-xs leading-5 text-gold-500">
          Delivery charges and final availability can be confirmed on WhatsApp.
        </p>
        <Link
          href="/checkout"
          className="btn-royal mt-5 flex h-12 items-center justify-center rounded-[4px] text-sm font-bold"
        >
          Checkout
        </Link>
      </aside>
    </div>
  );
}
