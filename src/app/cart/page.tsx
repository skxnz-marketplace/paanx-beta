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
      <section className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <h1 className="text-3xl font-black text-emerald-950">Your cart is empty</h1>
        <p className="mt-3 text-sm text-zinc-600">
          Add paan kits, ingredients, and essentials to begin an order.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-emerald-900 px-5 text-sm font-bold text-white"
        >
          Shop PAANX
        </Link>
      </section>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="space-y-3">
        <h1 className="text-3xl font-black text-emerald-950">Cart</h1>
        {hasRestrictedItem ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
            Your cart contains 18+ restricted items. Age confirmation may be
            required before delivery.
          </div>
        ) : null}
        <div className="space-y-3">
          {lines.map(({ product, quantity }) => (
            <article
              key={product.id}
              className="grid grid-cols-[88px_1fr] gap-3 rounded-lg border border-zinc-200 bg-white p-3"
            >
              <div className="aspect-square overflow-hidden rounded-md border border-zinc-100">
                <ProductImage product={product} />
              </div>
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                      {product.brand}
                    </p>
                    <h2 className="mt-1 text-sm font-bold text-zinc-950">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-xs text-zinc-500">
                      {product.packSize}
                      {product.isRestricted ? " · 18+" : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-200 text-zinc-500"
                    aria-label={`Remove ${product.name}`}
                  >
                    <Trash2 size={16} aria-hidden />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-zinc-200">
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
                  <strong className="text-sm text-emerald-950">
                    {formatPrice(product.price * quantity)}
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="text-lg font-bold text-zinc-950">Order Summary</h2>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-zinc-600">Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <p className="mt-2 text-xs leading-5 text-zinc-500">
          Delivery charges and final availability can be confirmed on WhatsApp.
        </p>
        <Link
          href="/checkout"
          className="mt-5 flex h-12 items-center justify-center rounded-md bg-emerald-900 text-sm font-bold text-white"
        >
          Checkout
        </Link>
      </aside>
    </div>
  );
}
