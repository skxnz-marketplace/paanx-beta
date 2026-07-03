import { formatPrice } from "@/lib/format";

export default function PriceBadge({
  price,
  mrp,
}: {
  price: number;
  mrp?: number;
}) {
  const showMrp = typeof mrp === "number" && mrp > price;
  const off = showMrp ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <div className="flex flex-wrap items-baseline gap-1.5">
      <span className="text-base font-black tracking-tight text-gold-100 tabular-nums">
        {formatPrice(price)}
      </span>
      {showMrp ? (
        <>
          <span className="text-xs text-gold-500/70 line-through tabular-nums">
            {formatPrice(mrp)}
          </span>
          <span className="rounded-full bg-royal-700/60 px-1.5 py-0.5 text-[10px] font-bold text-gold-100 ring-1 ring-gold-500/40">
            {off}% off
          </span>
        </>
      ) : null}
    </div>
  );
}
