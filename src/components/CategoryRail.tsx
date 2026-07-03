import Link from "next/link";
import { categories } from "@/data/categories";

export default function CategoryRail() {
  return (
    <div className="no-scrollbar -mx-4 overflow-x-auto px-4">
      <div className="flex gap-2 py-1.5">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="card-lift group flex shrink-0 items-center gap-2 rounded-[3px] border border-gold-200/12 bg-gold-200/[0.05] px-4 py-2.5 text-sm font-semibold text-gold-100 backdrop-blur-xl transition hover:border-gold-500/55 hover:bg-gold-200/[0.09]"
          >
            <span className="whitespace-nowrap">{category.name}</span>
            {category.isRestricted ? (
              <span className="rounded-[2px] bg-royal-700/70 px-1.5 py-0.5 text-[9px] font-bold text-gold-100 ring-1 ring-gold-500/40">
                18+
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
