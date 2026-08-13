import { cn } from "@/lib/utils";
import { CategoryIcon } from "./Icon";

/*
 * Generated abstract Islamic-style cover art. Deterministic per `seed` so a
 * given Bayan always renders the same artwork. Purely original geometry —
 * an eight-point star motif over a calm green gradient. Used as a placeholder
 * until real cover images are provided via Supabase Storage.
 */

const PALETTES: Array<[string, string]> = [
  ["#1a5140", "#0f2e25"],
  ["#1f664c", "#153f32"],
  ["#2f8060", "#123a2d"],
  ["#155e4a", "#0b241d"],
  ["#1a5140", "#243b2f"],
];

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function CoverArt({
  seed,
  icon,
  className,
  rounded = "rounded-2xl",
}: {
  seed: string;
  icon?: string;
  className?: string;
  rounded?: string;
}) {
  const h = hash(seed);
  const [c1, c2] = PALETTES[h % PALETTES.length];
  const rotate = h % 45;
  const gid = `g-${h % 100000}`;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-primary-800",
        rounded,
        className
      )}
    >
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill={`url(#${gid})`} />
        <g
          transform={`rotate(${rotate} 100 100)`}
          stroke="#c69749"
          strokeOpacity="0.22"
          fill="none"
          strokeWidth="1"
        >
          {/* Eight-point star (two overlaid squares) */}
          <rect x="55" y="55" width="90" height="90" />
          <rect
            x="55"
            y="55"
            width="90"
            height="90"
            transform="rotate(45 100 100)"
          />
          <circle cx="100" cy="100" r="64" strokeOpacity="0.12" />
          <circle cx="100" cy="100" r="30" strokeOpacity="0.18" />
        </g>
        <g stroke="#c69749" strokeOpacity="0.10" strokeWidth="1" fill="none">
          <path d="M0 40 H200 M0 100 H200 M0 160 H200 M40 0 V200 M100 0 V200 M160 0 V200" />
        </g>
      </svg>
      {icon ? (
        <div className="absolute inset-0 grid place-items-center">
          <CategoryIcon
            name={icon}
            className="text-4xl text-gold-300/80"
            strokeWidth={1.2}
          />
        </div>
      ) : null}
    </div>
  );
}
