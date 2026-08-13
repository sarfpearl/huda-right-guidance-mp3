"use client";

import { useState } from "react";
import { ShareIcon, CheckIcon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Share control. Uses the Web Share API when available (mobile), otherwise
 * copies the URL to the clipboard with visual confirmation.
 */
export function ShareButton({
  url,
  title,
  text,
  variant = "solid",
  className,
}: {
  url: string;
  title: string;
  text?: string;
  variant?: "solid" | "ghost";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — nothing we can safely do */
    }
  }

  const styles =
    variant === "solid"
      ? "h-11 rounded-full border surface px-4 text-sm hover:border-primary-300"
      : "h-10 w-10 rounded-full border surface hover:border-primary-300";

  return (
    <button
      type="button"
      onClick={onShare}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors",
        styles,
        className
      )}
      aria-label={copied ? "Link copied" : "Share this Bayan"}
    >
      {copied ? (
        <CheckIcon className="text-lg text-primary-600" />
      ) : (
        <ShareIcon className="text-lg" />
      )}
      {variant === "solid" ? (copied ? "Copied!" : "Share") : null}
    </button>
  );
}
