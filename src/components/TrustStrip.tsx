import { BadgeCheck, Clock3, ShieldCheck } from "lucide-react";

const items = [
  { label: "Curated catalog", sub: "Hand-picked SKUs", Icon: BadgeCheck },
  { label: "Age-aware checkout", sub: "Responsible 18+ flow", Icon: ShieldCheck },
  { label: "Fast local ordering", sub: "Delhi NCR beta", Icon: Clock3 },
];

export default function TrustStrip() {
  return (
    <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {items.map(({ label, sub, Icon }) => (
        <div
          key={label}
          className="card-lift flex items-center gap-3 rounded-[4px] border border-gold-200/10 glass px-4 py-3.5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-gradient-to-b from-royal-600 to-royal-800 text-gold-200 ring-1 ring-gold-500/25">
            <Icon size={18} aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-gold-100">{label}</span>
            <span className="block text-[11px] font-medium text-gold-500">
              {sub}
            </span>
          </span>
        </div>
      ))}
    </section>
  );
}
