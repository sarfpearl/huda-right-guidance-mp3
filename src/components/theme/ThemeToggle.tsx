"use client";

import { useTheme } from "./ThemeProvider";
import { MoonIcon, SunIcon } from "@/components/ui/Icon";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      className={
        "grid h-10 w-10 place-items-center rounded-full border surface text-lg text-muted transition-colors hover:text-primary-600 hover:border-primary-300 dark:hover:text-primary-300 " +
        (className ?? "")
      }
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
