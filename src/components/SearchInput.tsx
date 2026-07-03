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
      className="relative w-full"
    >
      <Search
        size={17}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        aria-hidden
      />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search paan, mukhwas, ingredients"
        className={`w-full rounded-md border border-zinc-200 bg-white pl-10 pr-3 text-sm text-zinc-950 outline-none ring-emerald-900/10 transition focus:border-emerald-900 focus:ring-4 ${
          compact ? "h-10" : "h-12"
        }`}
      />
    </form>
  );
}
