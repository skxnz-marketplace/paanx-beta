"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useAgeConfirmed } from "@/components/AgeGate";
import { restrictedCategories } from "@/data/products";

export default function AgeGatePage() {
  const { confirmed, confirmAge } = useAgeConfirmed();

  return (
    <section className="mx-auto max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 text-center">
      <ShieldCheck
        size={44}
        className="mx-auto text-emerald-900"
        aria-hidden
      />
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
        Age verification
      </p>
      <h1 className="mt-2 text-3xl font-black text-emerald-950">
        Restricted products require 18+ confirmation
      </h1>
      <p className="mt-4 text-sm leading-6 text-zinc-600">
        PAANX marks restricted products clearly and stores adult confirmation in
        this browser only.
      </p>
      <div className="mt-5 rounded-lg bg-[#f2f4ee] p-4 text-left text-sm text-zinc-700">
        <strong className="text-emerald-950">Restricted categories:</strong>{" "}
        {restrictedCategories.join(", ")}.
      </div>
      <button
        type="button"
        onClick={confirmAge}
        className="mt-6 h-12 w-full rounded-md bg-emerald-900 text-sm font-bold text-white sm:w-64"
      >
        {confirmed ? "18+ confirmed" : "Confirm I am 18+"}
      </button>
      <div className="mt-4">
        <Link href="/" className="text-sm font-bold text-emerald-900">
          Return to PAANX
        </Link>
      </div>
    </section>
  );
}
