import { formatPrice } from "@/lib/format";

export default function PriceBadge({
  price,
  mrp,
}: {
  price: number;
  mrp: number;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-1.5">
      <span className="text-sm font-bold text-emerald-950">
        {formatPrice(price)}
      </span>
      {mrp > price ? (
        <span className="text-xs text-zinc-400 line-through">
          {formatPrice(mrp)}
        </span>
      ) : null}
    </div>
  );
}
