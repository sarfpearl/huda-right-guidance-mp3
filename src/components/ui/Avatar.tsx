import Image from "next/image";
import { cn } from "@/lib/utils";

/** Speaker avatar — real image if provided, else an initials monogram. */
export function Avatar({
  name,
  src,
  size = 64,
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  const initials = name
    .replace(/\(demo\)/i, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid place-items-center rounded-full bg-primary-700 font-semibold text-sand-50",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials || "•"}
    </div>
  );
}
