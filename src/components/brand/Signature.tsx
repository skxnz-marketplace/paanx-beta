// Elegant cursive brand signature — "by Vrishank Poddar" in deep royal gold.
export default function Signature({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-script leading-none [text-shadow:0_1px_6px_rgba(194,155,63,0.25)] ${className}`}
    >
      by Vrishank Poddar
    </span>
  );
}
