import { BadgeCheck, Clock3, ShieldCheck } from "lucide-react";

const items = [
  { label: "Curated catalog", Icon: BadgeCheck },
  { label: "Age-aware checkout", Icon: ShieldCheck },
  { label: "Fast local ordering", Icon: Clock3 },
];

export default function TrustStrip() {
  return (
    <section className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {items.map(({ label, Icon }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-lg border border-emerald-900/10 bg-white px-4 py-3 text-sm font-semibold text-emerald-950"
        >
          <Icon size={18} aria-hidden />
          {label}
        </div>
      ))}
    </section>
  );
}
