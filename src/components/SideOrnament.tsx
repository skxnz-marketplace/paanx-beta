// Rajasthani jharokha / jali side rails — fills the empty desktop gutters.
// Hand-drawn decorative SVG, explicitly requested. Fixed, non-interactive,
// low-opacity sandlewood line-work in a repeating ogee-arch + paisley motif.

function OrnamentColumn({ flip }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden
      className="h-full w-full"
      viewBox="0 0 120 480"
      preserveAspectRatio="xMidYMid slice"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <defs>
        {/* one repeating jharokha unit, 120 x 240 */}
        <pattern
          id="jali"
          x="0"
          y="0"
          width="120"
          height="240"
          patternUnits="userSpaceOnUse"
        >
          <g
            fill="none"
            stroke="#cdb488"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* ogee arch */}
            <path d="M60 8 C 96 40, 96 96, 60 128 C 24 96, 24 40, 60 8 Z" />
            <path d="M60 22 C 84 46, 84 92, 60 112 C 36 92, 36 46, 60 22 Z" />
            {/* central bud */}
            <circle cx="60" cy="66" r="7" />
            <path d="M60 59 L60 73 M53 66 L67 66" />
            {/* paisley / ambi pair */}
            <path d="M40 150 c -14 -4 -18 16 -4 20 c 10 3 12 -8 6 -14" />
            <path d="M80 150 c 14 -4 18 16 4 20 c -10 3 -12 -8 -6 -14" />
            {/* connecting stem + dots */}
            <path d="M60 128 L60 150" />
            <circle cx="60" cy="182" r="3.2" />
            <circle cx="60" cy="200" r="2" />
            <circle cx="60" cy="216" r="1.4" />
            {/* side border rule */}
            <path d="M12 0 L12 240" strokeWidth="0.8" />
          </g>
        </pattern>
      </defs>
      <rect x="0" y="0" width="120" height="480" fill="url(#jali)" />
    </svg>
  );
}

export default function SideOrnament() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 z-0 hidden xl:block"
    >
      {/* left rail */}
      <div className="fixed inset-y-0 left-0 w-[7.5rem] opacity-[0.5] [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)]">
        <OrnamentColumn />
      </div>
      {/* right rail (mirrored) */}
      <div className="fixed inset-y-0 right-0 w-[7.5rem] opacity-[0.5] [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)]">
        <OrnamentColumn flip />
      </div>
    </div>
  );
}
