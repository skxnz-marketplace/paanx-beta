# PAANX brand assets

Drop the two provided brand images here, with these exact names:

- `paanx-emblem.png` — the standalone gold PAANX symbol / mark (square).
- `paanx-wordmark.png` — the standalone gold "PAANX" text wordmark (wide).

The site references these via `src/components/brand/PaanxLogo.tsx`. Until the
files exist, the logo gracefully falls back to a styled `PAANX` text mark, so
the layout never breaks.

Guidance:
- Export at 2x for crispness (e.g. emblem 512×512, wordmark ~1600×480), PNG with
  transparent background so the gold sits on the dark royal surface.
- Keep transparent padding minimal; the component adds its own breathing space.
