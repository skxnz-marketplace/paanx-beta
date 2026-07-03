import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CategoryRail from "@/components/CategoryRail";
import ProductGrid from "@/components/ProductGrid";
import Reveal from "@/components/Reveal";
import TrustStrip from "@/components/TrustStrip";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

function byCategory(slug: string, limit = 5) {
  return products.filter((p) => p.category === slug).slice(0, limit);
}

function SectionHeader({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-gold-500">
          <span className="h-px w-5 bg-gold-500/70" />
          {eyebrow}
        </p>
        <h2 className="font-display mt-1.5 text-2xl font-black tracking-tight text-gold-100 md:text-[28px]">
          {title}
        </h2>
      </div>
      {href ? (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-1 text-[13px] font-bold uppercase tracking-[0.1em] text-gold-300 transition hover:text-gold-100"
        >
          View all <ArrowRight size={15} aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}

export default function Home() {
  const popular = products
    .filter((p) => !p.isRestricted && p.tags?.includes("bestseller"))
    .slice(0, 5);
  const popularFill =
    popular.length >= 5
      ? popular
      : [...popular, ...products.filter((p) => !p.isRestricted)].slice(0, 5);
  const drinks = byCategory("cold-drinks");
  const freshers = byCategory("mouth-fresheners");
  const paan = byCategory("paan-ingredients");
  const restricted = products.filter((p) => p.isRestricted).slice(0, 5);

  return (
    <div className="space-y-14">
      {/* ===== HERO ===== */}
      <Reveal as="section" className="!overflow-visible">
        <div className="glass-royal relative overflow-hidden rounded-[6px] p-6 md:p-14">
          {/* faint jali texture, no glow */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(rgba(231,212,187,0.8)_1px,transparent_1px)] [background-size:26px_26px]" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-[3px] border border-gold-500/40 bg-gold-200/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-300">
              Delhi NCR · Private Beta
            </span>
            <h1 className="sr-only">PAANX</h1>
            <Image
              src="/brand/paanx-wordmark.png"
              alt="PAANX"
              width={1672}
              height={941}
              priority
              className="mt-6 h-24 w-auto md:h-44"
            />
            <p className="font-display mt-2 text-xl font-medium tracking-tight text-gold-200/85 md:text-3xl">
              The paan lounge, delivered.
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-gold-200/70">
              Curated paan-shop essentials, snacks, drinks and grown-up
              favourites. Fast local ordering. Age-aware checkout.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="btn-gold flex h-12 items-center gap-2 rounded-[4px] px-7 text-sm font-bold uppercase tracking-[0.1em]"
              >
                Explore catalog
                <ArrowRight size={17} aria-hidden />
              </Link>
              <Link
                href="/category/paan-ingredients"
                className="flex h-12 items-center rounded-[4px] border border-gold-500/40 bg-gold-200/[0.04] px-7 text-sm font-bold uppercase tracking-[0.1em] text-gold-100 transition hover:border-gold-500/70 hover:bg-gold-200/[0.08]"
              >
                Paan essentials
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-[4px] border border-gold-500/20 bg-gold-500/20 md:max-w-lg">
              {[
                { value: products.length, label: "Curated items" },
                { value: categories.length, label: "Categories" },
                { value: "COD", label: "UPI coming soon" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-carbon/60 px-3 py-4 text-center backdrop-blur"
                >
                  <strong className="font-display block text-3xl font-semibold tracking-tight text-gold-100 tabular-nums">
                    {stat.value}
                  </strong>
                  <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-500">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section">
        <TrustStrip />
      </Reveal>

      <Reveal as="section" className="space-y-4">
        <SectionHeader eyebrow="Browse" title="Shop by category" />
        <CategoryRail />
      </Reveal>

      <Reveal as="section" className="space-y-5">
        <SectionHeader eyebrow="Loved locally" title="Popular near you" href="/search" />
        <ProductGrid products={popularFill} />
      </Reveal>

      <Reveal as="section" className="space-y-5">
        <SectionHeader
          eyebrow="Chilled"
          title="Cold drinks & refreshers"
          href="/category/cold-drinks"
        />
        <ProductGrid products={drinks} />
      </Reveal>

      <Reveal as="section" className="space-y-5">
        <SectionHeader
          eyebrow="After-meal ritual"
          title="Mouth fresheners"
          href="/category/mouth-fresheners"
        />
        <ProductGrid products={freshers} />
      </Reveal>

      <Reveal as="section" className="space-y-5">
        <SectionHeader
          eyebrow="The craft"
          title="Paan essentials"
          href="/category/paan-ingredients"
        />
        <ProductGrid products={paan} />
      </Reveal>

      <Reveal as="section" className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-gold-500">
              <span className="h-px w-5 bg-gold-500/70" />
              Adults only
            </p>
            <h2 className="font-display mt-1.5 text-2xl font-black tracking-tight text-gold-100 md:text-[28px]">
              18+ essentials
            </h2>
          </div>
          <span className="rounded-full border border-gold-500/40 bg-gradient-to-b from-gold-200 to-gold-400 px-3 py-1 text-xs font-bold text-royal-900">
            Age gate
          </span>
        </div>
        <ProductGrid products={restricted} />
      </Reveal>
    </div>
  );
}
