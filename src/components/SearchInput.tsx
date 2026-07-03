"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchInput({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }}
      className="group relative w-full"
    >
      <Search
        size={17}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500 transition group-focus-within:text-gold-300"
        aria-hidden
      />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search paan, mukhwas, snacks, drinks…"
        aria-label="Search products"
        className={`w-full rounded-[4px] border border-gold-200/12 bg-gold-200/[0.05] pl-11 pr-3 text-sm text-gold-100 outline-none backdrop-blur-xl transition placeholder:text-gold-500/70 focus:border-gold-500/60 focus:bg-gold-200/[0.09] focus:ring-4 focus:ring-gold-500/15 ${
          compact ? "h-11" : "h-12"
        }`}
      />
    </form>
  );
}
