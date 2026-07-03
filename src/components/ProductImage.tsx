"use client";

import { useState } from "react";
import type { Product } from "@/data/products";

// Presentation-only per-category tint so the fallback feels like deliberate
// premium packaging on the dark carbon theme. Does not touch data.
const categoryTint: Record<string, string> = {
  "cold-drinks": "rgba(99,47,60,0.5)",
  "water-soda": "rgba(80,90,110,0.4)",
  chips: "rgba(133,120,97,0.42)",
  namkeen: "rgba(133,120,97,0.4)",
  biscuits: "rgba(120,100,75,0.4)",
  chocolates: "rgba(72,37,47,0.5)",
  "mints-gum": "rgba(90,110,100,0.35)",
  "mouth-fresheners": "rgba(120,100,80,0.4)",
  "paan-ingredients": "rgba(90,100,70,0.38)",
  "supari-saunf": "rgba(120,105,75,0.4)",
  "pan-masala": "rgba(99,47,60,0.5)",
  cigarettes: "rgba(72,37,47,0.55)",
  "khaini-zarda": "rgba(80,55,45,0.5)",
  "hookah-flavours": "rgba(72,37,47,0.55)",
  "lighters-accessories": "rgba(133,120,97,0.42)",
};

export default function ProductImage({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false);
  const showImage = product.image && !failed;

  if (showImage) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#1b1919] to-[#0d0e0e] p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          onError={() => setFailed(true)}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  const tint = categoryTint[product.category] ?? "rgba(99,47,60,0.5)";

  // Designed dark fallback — carbon field, category-tinted glow, almond medallion.
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(120% 120% at 30% 8%, #1c1a1a, #0d0e0e)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(75% 75% at 75% 82%, ${tint}, transparent 72%)`,
        }}
      />
      <div className="pointer-events-none absolute h-32 w-32 rounded-full border border-gold-500/15" />
      <div className="pointer-events-none absolute h-24 w-24 rounded-full border border-gold-500/10" />
      <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-gold-500/50 bg-gradient-to-b from-gold-200/20 to-gold-200/[0.04] shadow-[inset_0_1px_0_rgba(231,212,187,0.25),0_10px_24px_-10px_rgba(0,0,0,0.8)] backdrop-blur">
        <span className="font-display text-xl font-black tracking-tight text-gold-100">
          {initials}
        </span>
      </div>
      <span className="absolute bottom-2 text-[8px] font-semibold uppercase tracking-[0.3em] text-gold-500/60">
        PAANX
      </span>
    </div>
  );
}
