"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

const whatsappNumber = "+91XXXXXXXXXX";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, hasRestrictedItem, clearCart } = useCart();
  const [paymentMode, setPaymentMode] = useState("COD");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const orderId = `PX-${Date.now()}`;
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        name: String(form.get("name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        address: String(form.get("address") ?? ""),
        notes: String(form.get("notes") ?? ""),
      },
      paymentMode,
      lines: lines.map(({ product, quantity }) => ({
        id: product.id,
        name: product.name,
        quantity,
        price: product.price,
        isRestricted: product.isRestricted,
      })),
      subtotal,
      hasRestrictedItem,
    };

    const previous = JSON.parse(
      window.localStorage.getItem("paanx-orders-v01") ?? "[]",
    ) as unknown[];
    window.localStorage.setItem(
      "paanx-orders-v01",
      JSON.stringify([order, ...previous]),
    );
    window.localStorage.setItem("paanx-last-order-v01", JSON.stringify(order));

    const message = [
      `PAANX Order ${orderId}`,
      "",
      `Name: ${order.customer.name}`,
      `Phone: ${order.customer.phone}`,
      `Address: ${order.customer.address}`,
      `Payment: ${paymentMode}`,
      "",
      "Items:",
      ...lines.map(
        ({ product, quantity }) =>
          `- ${product.name} x ${quantity} = ${formatPrice(product.price * quantity)}`,
      ),
      "",
      `Subtotal: ${formatPrice(subtotal)}`,
      hasRestrictedItem ? "18+ restricted items included." : "",
      order.customer.notes ? `Notes: ${order.customer.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${whatsappNumber.replace("+", "")}?text=${encodeURIComponent(
        message,
      )}`,
      "_blank",
      "noopener,noreferrer",
    );

    clearCart();
    router.push("/order-success");
  }

  if (lines.length === 0) {
    return (
      <section className="rounded-[4px] border border-gold-200/10 glass p-10 text-center">
        <h1 className="font-display text-4xl font-black tracking-tight text-gold-100">
          Nothing to checkout
        </h1>
        <p className="mt-3 text-sm text-gold-200/65">
          Your cart is empty. Add products before placing an order.
        </p>
      </section>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="rounded-[4px] border border-gold-200/10 glass p-5 md:p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-500">
          Checkout
        </p>
        <h1 className="font-display mt-1.5 text-4xl font-black tracking-tight text-gold-100">
          Delivery details
        </h1>
        {hasRestrictedItem ? (
          <div className="mt-4 rounded-[4px] border border-gold-400/40 bg-royal-700/40 p-4 text-sm font-semibold text-gold-100">
            This order contains 18+ restricted items. Confirm age eligibility and
            keep valid ID available at delivery.
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block text-sm font-semibold text-gold-100">
            Name
            <input
              required
              name="name"
              className="mt-2 h-11 w-full rounded-[4px] border border-gold-200/12 bg-gold-200/[0.07] px-3 text-gold-100 outline-none transition focus:border-gold-400/70 focus:bg-gold-200/[0.1] focus:ring-4 focus:ring-gold-400/15"
            />
          </label>
          <label className="block text-sm font-semibold text-gold-100">
            Phone
            <input
              required
              name="phone"
              inputMode="tel"
              className="mt-2 h-11 w-full rounded-[4px] border border-gold-200/12 bg-gold-200/[0.07] px-3 text-gold-100 outline-none transition focus:border-gold-400/70 focus:bg-gold-200/[0.1] focus:ring-4 focus:ring-gold-400/15"
            />
          </label>
          <label className="block text-sm font-semibold text-gold-100">
            Address
            <textarea
              required
              name="address"
              rows={4}
              className="mt-2 w-full rounded-[4px] border border-gold-200/12 bg-gold-200/[0.07] px-3 py-3 text-gold-100 outline-none transition focus:border-gold-400/70 focus:bg-gold-200/[0.1] focus:ring-4 focus:ring-gold-400/15"
            />
          </label>
          <label className="block text-sm font-semibold text-gold-100">
            Notes
            <textarea
              name="notes"
              rows={3}
              className="mt-2 w-full rounded-[4px] border border-gold-200/12 bg-gold-200/[0.07] px-3 py-3 text-gold-100 outline-none transition focus:border-gold-400/70 focus:bg-gold-200/[0.1] focus:ring-4 focus:ring-gold-400/15"
            />
          </label>
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-gold-100">
              Payment mode
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {["COD", "UPI on delivery"].map((mode) => (
                <label
                  key={mode}
                  className={`flex cursor-pointer items-center justify-center rounded-[3px] border px-3 py-3 text-sm font-bold ${
                    paymentMode === mode
                      ? "border-gold-500/70 bg-royal-700/55 text-gold-100"
                      : "border-gold-200/12 bg-gold-200/[0.05] text-gold-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    value={mode}
                    checked={paymentMode === mode}
                    onChange={() => setPaymentMode(mode)}
                    className="sr-only"
                  />
                  {mode}
                </label>
              ))}
            </div>
          </fieldset>
          <button
            type="submit"
            className="btn-royal h-12 w-full rounded-[4px] text-sm font-bold"
          >
            Place order on WhatsApp
          </button>
        </form>
      </section>
      <aside className="h-fit rounded-[4px] border border-gold-200/10 glass p-5 lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-black tracking-tight text-gold-100">Items</h2>
        <div className="mt-3 space-y-3">
          {lines.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between gap-3 text-sm">
              <span className="text-gold-200/65">
                {product.name} x {quantity}
              </span>
              <strong>{formatPrice(product.price * quantity)}</strong>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-gold-200/10 pt-4 text-sm">
          <span>Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
      </aside>
    </div>
  );
}
