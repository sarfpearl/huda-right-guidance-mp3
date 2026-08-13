import type { BayanSort } from "@/types/bayan";

/** Coerce an unknown query value into a valid BayanSort (default "latest"). */
export function parseSort(value: unknown): BayanSort {
  return value === "popular" || value === "duration" ? value : "latest";
}
