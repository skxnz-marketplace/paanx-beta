"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  getCategoryBySlug,
  getProductBySlug,
  restrictedCategories,
} from "@/data/products";

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
    <div className="fixed inset-0 z-50 flex items-end bg-emerald-950/40 p-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <section className="w-full rounded-lg border border-emerald-100 bg-white p-5 shadow-2xl sm:max-w-md">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
          Age restricted
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
          Confirm you are 18+
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Some PAANX products are available only to adults. Restricted categories
          include {restrictedCategories.join(", ")}.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href="/"
            className="rounded-md border border-zinc-200 px-4 py-3 text-center text-sm font-semibold text-zinc-800"
          >
            Leave
          </Link>
          <button
            type="button"
            onClick={confirmAge}
            className="rounded-md bg-emerald-900 px-4 py-3 text-sm font-semibold text-white"
          >
            I am 18+
          </button>
        </div>
      </section>
    </div>
  );
}
