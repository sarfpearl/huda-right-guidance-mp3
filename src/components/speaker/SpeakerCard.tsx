import Link from "next/link";
import type { Speaker } from "@/types/speaker";
import { Avatar } from "@/components/ui/Avatar";

export function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <Link
      href={`/speaker/${speaker.slug}`}
      className="group flex w-40 shrink-0 flex-col items-center gap-2 rounded-2xl border surface p-4 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-soft-lg"
    >
      <Avatar
        name={speaker.name}
        src={speaker.profileImageUrl}
        size={80}
        className="ring-2 ring-transparent transition group-hover:ring-primary-300"
      />
      <span className="line-clamp-1 font-semibold">{speaker.name}</span>
      <span className="text-xs text-muted">{speaker.bayanCount ?? 0} Bayan</span>
    </Link>
  );
}
