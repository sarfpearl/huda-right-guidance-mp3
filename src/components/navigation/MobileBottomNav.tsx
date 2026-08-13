"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CompassIcon,
  GridIcon,
  HomeIcon,
  SearchIcon,
} from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/explore", label: "Explore", Icon: CompassIcon },
  { href: "/categories", label: "Categories", Icon: GridIcon },
  { href: "/search", label: "Search", Icon: SearchIcon },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {ITEMS.map(({ href, label, Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-primary-700 dark:text-primary-300" : "text-muted"
                )}
              >
                <Icon className="text-xl" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
