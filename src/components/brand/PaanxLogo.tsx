"use client";

import Image from "next/image";
import { useState } from "react";

export type PaanxLogoVariant = "mark" | "wordmark" | "full" | "compact";

const EMBLEM = "/brand/paanx-emblem.png";
const WORDMARK = "/brand/paanx-wordmark.png";

// Fixed display heights per variant (width auto via object-contain box).
// object-contain guarantees no stretch / crop / distortion regardless of the
// exported file's exact aspect ratio.
// Wordmark PNG aspect is ~1.78:1 (1672x941). Display boxes match that ratio so
// the wordmark sits tight to the emblem with no empty letterbox gap.
const SIZES: Record<
  PaanxLogoVariant,
  { emblem: number | null; word: { h: number; w: number } | null; gap: string }
> = {
  mark: { emblem: 40, word: null, gap: "" },
  compact: { emblem: 32, word: null, gap: "" },
  wordmark: { emblem: null, word: { h: 40, w: 71 }, gap: "" },
  full: { emblem: 36, word: { h: 34, w: 60 }, gap: "gap-2" },
};

function TextFallback({ height }: { height: number }) {
  return (
    <span
      className="font-display font-semibold uppercase tracking-[0.14em] text-gold-200"
      style={{ fontSize: Math.round(height * 0.62), lineHeight: 1 }}
    >
      PAANX
    </span>
  );
}

export default function PaanxLogo({
  variant = "full",
  priority = false,
  className = "",
}: {
  variant?: PaanxLogoVariant;
  priority?: boolean;
  className?: string;
}) {
  const [emblemFailed, setEmblemFailed] = useState(false);
  const [wordFailed, setWordFailed] = useState(false);
  const cfg = SIZES[variant];

  const showEmblem = cfg.emblem !== null && !emblemFailed;
  const showWord = cfg.word !== null && !wordFailed;

  // Emblem block (square).
  const emblemEl =
    cfg.emblem !== null ? (
      showEmblem ? (
        <span
          className="relative block shrink-0"
          style={{ height: cfg.emblem, width: cfg.emblem }}
        >
          <Image
            src={EMBLEM}
            alt=""
            fill
            sizes={`${cfg.emblem}px`}
            priority={priority}
            className="object-contain"
            onError={() => setEmblemFailed(true)}
          />
        </span>
      ) : cfg.word === null ? (
        // mark/compact with no wordmark: fall back to text
        <TextFallback height={cfg.emblem} />
      ) : null
    ) : null;

  // Wordmark block (wide).
  const wordEl =
    cfg.word !== null ? (
      showWord ? (
        <span
          className="relative block shrink-0"
          style={{ height: cfg.word.h, width: cfg.word.w }}
        >
          <Image
            src={WORDMARK}
            alt=""
            fill
            sizes={`${cfg.word.w}px`}
            priority={priority}
            className="object-contain object-left"
            onError={() => setWordFailed(true)}
          />
        </span>
      ) : (
        <TextFallback height={cfg.word.h} />
      )
    ) : null;

  return (
    <span
      aria-label="PAANX home"
      className={`inline-flex items-center ${cfg.gap} ${className}`}
    >
      {emblemEl}
      {wordEl}
    </span>
  );
}
