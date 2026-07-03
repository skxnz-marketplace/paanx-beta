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
    <section className="glass-royal animate-rise overflow-hidden rounded-[4px] p-10 text-center text-ivory">
      <CheckCircle2
        size={48}
        className="mx-auto text-gold-300"
        aria-hidden
      />
      <h1 className="font-display mt-4 text-4xl font-black tracking-tight text-ivory">
        Order saved
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ivory/70">
        Your PAANX beta order was saved locally and the WhatsApp message was
        generated for confirmation.
      </p>
      {order ? (
        <p className="mt-4 text-sm font-bold text-gold-200">
          Reference: {order.id}
        </p>
      ) : null}
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/"
          className="btn-gold rounded-[4px] px-5 py-3 text-sm font-bold"
        >
          Continue shopping
        </Link>
        <Link
          href="/legal"
          className="rounded-[4px] border border-gold-400/30 px-5 py-3 text-sm font-bold text-ivory/80 transition hover:bg-gold-200/[0.05]"
        >
          Legal
        </Link>
      </div>
    </section>
  );
}
