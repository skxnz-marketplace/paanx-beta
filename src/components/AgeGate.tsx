"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import PaanxLogo from "@/components/brand/PaanxLogo";
import Signature from "@/components/brand/Signature";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  getCategoryBySlug,
  restrictedCategories,
} from "@/data/categories";
import { getProductBySlug } from "@/data/products";

const storageKey = "paanx-age-confirmed-v01";

export function useAgeConfirmed() {
  const [confirmed, setConfirmed] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem(storageKey) === "true",
  );

  const confirmAge = () => {
    window.localStorage.setItem(storageKey, "true");
    setConfirmed(true);
  };

  return { confirmed, confirmAge };
}

export default function AgeGate() {
  const pathname = usePathname();
  const { confirmed, confirmAge } = useAgeConfirmed();

  const requiresGate = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "age-gate") return true;
    if (segments[0] === "checkout") return false;
    if (segments[0] === "category" && segments[1]) {
      return Boolean(getCategoryBySlug(segments[1])?.isRestricted);
    }
    if (segments[0] === "product" && segments[1]) {
      return Boolean(getProductBySlug(segments[1])?.isRestricted);
    }
    return false;
  }, [pathname]);

  if (!requiresGate || confirmed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-royal-950/55 p-4 backdrop-blur-md sm:items-center sm:justify-center">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="agegate-title"
        className="glass-royal animate-rise w-full rounded-[4px] p-6 text-ivory sm:max-w-md"
      >
        <div className="mb-5 flex items-start justify-between">
          <span className="flex flex-col">
            <PaanxLogo variant="mark" />
            <Signature className="mt-1 text-[15px]" />
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-white/10 text-gold-200 ring-1 ring-gold-400/30">
            <ShieldCheck size={22} aria-hidden />
          </span>
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
          Age-restricted section
        </p>
        <h2
          id="agegate-title"
          className="mt-2 text-2xl font-black tracking-tight text-ivory"
        >
          Please confirm you are 18 or older
        </h2>
        <p className="mt-3 text-sm leading-6 text-ivory/70">
          A few PAANX categories are available to adults only. Restricted
          categories include {restrictedCategories.join(", ")}. Your confirmation
          is stored on this device only.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/"
            className="rounded-[4px] border border-gold-400/30 px-4 py-3 text-center text-sm font-semibold text-ivory/80 transition hover:bg-white/5"
          >
            Not now
          </Link>
          <button
            type="button"
            onClick={confirmAge}
            className="btn-gold rounded-[4px] px-4 py-3 text-sm font-bold"
          >
            I am 18+
          </button>
        </div>
      </section>
    </div>
  );
}
