import Link from "next/link";
import { categories } from "@/data/products";

export default function CategoryRail() {
  return (
    <div className="no-scrollbar -mx-4 overflow-x-auto px-4">
      <div className="flex gap-2 py-1">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="shrink-0 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 shadow-sm"
          >
            {category.name}
            {category.isRestricted ? (
              <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                18+
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
