"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/navigation/Header";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { GlobalAudioPlayer } from "@/components/player/GlobalAudioPlayer";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname?.startsWith("/admin");

  if (isHome) {
    return (
      <div className="fixed inset-0 overflow-hidden font-sans select-none bg-slate-950 z-0">
        {/* Full-screen homepage content */}
        {children}
      </div>
    );
  }

  return (
    <>
      {!isAdmin && <Header />}
      <main id="main" className="app-shell mx-auto min-h-screen max-w-6xl px-4 sm:px-6">
        {children}
      </main>
      <GlobalAudioPlayer />
      {!isAdmin && <MobileBottomNav />}
    </>
  );
}
