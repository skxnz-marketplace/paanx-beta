"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useAgeConfirmed } from "@/components/AgeGate";
import { restrictedCategories } from "@/data/categories";

export default function AgeGatePage() {
  const { confirmed, confirmAge } = useAgeConfirmed();

  return (
    <section className="glass-royal animate-rise mx-auto max-w-2xl overflow-hidden rounded-[4px] p-8 text-center text-ivory">
      <ShieldCheck
        size={44}
        className="mx-auto text-gold-300"
        aria-hidden
      />
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
        Age verification
      </p>
      <h1 className="font-display mt-2 text-3xl font-black tracking-tight text-ivory md:text-4xl">
        Restricted products require 18+ confirmation
      </h1>
      <p className="mt-4 text-sm leading-6 text-ivory/70">
        PAANX marks restricted products clearly and stores adult confirmation in
        this browser only.
      </p>
      <div className="mt-5 rounded-[4px] border border-gold-400/25 bg-gold-200/[0.05] p-4 text-left text-sm text-ivory/75">
        <strong className="text-gold-200">Restricted categories:</strong>{" "}
        {restrictedCategories.join(", ")}.
      </div>
      <button
        type="button"
        onClick={confirmAge}
        className="btn-gold mt-6 h-12 w-full rounded-[4px] text-sm font-bold sm:w-64"
      >
        {confirmed ? "18+ confirmed" : "Confirm I am 18+"}
      </button>
      <div className="mt-4">
        <Link href="/" className="text-sm font-bold text-gold-300 transition hover:text-gold-200">
          Return to PAANX
        </Link>
      </div>
    </section>
  );
}
