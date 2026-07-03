"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

type LastOrder = {
  id: string;
  createdAt: string;
};

export default function OrderSuccessPage() {
  const [order] = useState<LastOrder | null>(() => {
    if (typeof window === "undefined") return null;
    const rawOrder = window.localStorage.getItem("paanx-last-order-v01");
    return rawOrder ? (JSON.parse(rawOrder) as LastOrder) : null;
  });

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
      <CheckCircle2
        size={48}
        className="mx-auto text-emerald-900"
        aria-hidden
      />
      <h1 className="mt-4 text-3xl font-black text-emerald-950">
        Order saved
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-600">
        Your PAANX beta order was saved locally and the WhatsApp message was
        generated for confirmation.
      </p>
      {order ? (
        <p className="mt-4 text-sm font-bold text-zinc-950">
          Reference: {order.id}
        </p>
      ) : null}
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-emerald-900 px-5 py-3 text-sm font-bold text-white"
        >
          Continue shopping
        </Link>
        <Link
          href="/legal"
          className="rounded-md border border-zinc-200 px-5 py-3 text-sm font-bold text-zinc-800"
        >
          Legal
        </Link>
      </div>
    </section>
  );
}
