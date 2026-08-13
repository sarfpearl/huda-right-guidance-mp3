"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface ImmersiveBackgroundProps {
  categorySlug: string;
}

export function ImmersiveBackground({ categorySlug }: ImmersiveBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={categorySlug}
          initial={mounted ? { opacity: 0, scale: 1.04 } : false}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 h-full w-full"
        >
          <SceneElements categorySlug={categorySlug} />
        </motion.div>
      </AnimatePresence>

    </div>
  );
}

function SceneElements({ categorySlug }: { categorySlug: string }) {
  const sceneImages: Record<string, string> = {
    "iman-taqwa": "/images/scenes/iman-taqwa.jpg",
    "quran": "/images/scenes/quran.jpg",
    "salah": "/images/scenes/salah.jpg",
    "ramadan": "/images/scenes/ramadan.jpg",
    "dua": "/images/scenes/dua.jpg",
    "hajj-umrah": "/images/scenes/hajj-umrah.jpg",
    "akhlaq": "/images/scenes/akhlaq.jpg",
    "self-improvement": "/images/scenes/self-improvement.jpg",
    "womens-topics": "/images/scenes/womens-topics.jpg",
    "family": "/images/scenes/family.jpg",
    "marriage": "/images/scenes/marriage.jpg",
    "parenting": "/images/scenes/parenting.jpg",
    "youth": "/images/scenes/youth.jpg",
    "death-akhirah": "/images/scenes/death-akhirah.jpg",
    "islamic-history": "/images/scenes/islamic-history.jpg",
  };

  const imageSrc = sceneImages[categorySlug];

  if (imageSrc) {
    return (
      <div className="relative h-full w-full">
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
      </div>
    );
  }

  // Fallback visual scenes for other categories
  switch (categorySlug) {
    case "dua":
      return <DuaScene />;
    case "hajj-umrah":
      return <HajjScene />;
    case "family":
    case "marriage":
    case "parenting":
      return <FamilyScene />;
    case "youth":
      return <YouthScene />;
    case "akhlaq":
    case "self-improvement":
      return <AkhlaqScene />;
    case "death-akhirah":
      return <AkhirahScene />;
    case "islamic-history":
      return <HistoryScene />;
    case "womens-topics":
      return <WomensScene />;
    default:
      return <DefaultFallbackScene />;
  }
}

function DefaultFallbackScene() {
  return (
    <div className="relative h-full w-full bg-gradient-to-b from-[#02130e] via-[#05261d] to-[#010906]">
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:32px_32px]" />
    </div>
  );
}

function DuaScene() {
  return (
    <div className="relative h-full w-full bg-gradient-to-b from-[#05111d] via-[#091e33] to-[#02070e]">
      <StarsPattern count={60} color="bg-indigo-100" />
      <div className="absolute -top-20 left-1/3 w-72 h-[100dvh] bg-gradient-to-b from-blue-300/10 via-emerald-300/5 to-transparent rotate-12 blur-3xl pointer-events-none" />
    </div>
  );
}

function HajjScene() {
  return (
    <div className="relative h-full w-full bg-gradient-to-b from-[#121110] via-[#211d17] to-[#080706]">
      <StarsPattern count={40} color="bg-amber-100" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 md:w-64 h-36 md:h-48 bg-[#090807] border-t-2 border-amber-400/60 shadow-[0_-15px_40px_rgba(217,119,6,0.2)]">
        <div className="h-3 w-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 my-4 opacity-80" />
      </div>
    </div>
  );
}

function FamilyScene() {
  return (
    <div className="relative h-full w-full bg-gradient-to-b from-[#1c140e] via-[#241a15] to-[#0c0805]">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:28px_28px]" />
    </div>
  );
}

function YouthScene() {
  return (
    <div className="relative h-full w-full bg-gradient-to-b from-[#0b1b24] via-[#0d2f38] to-[#040e12]">
      <StarsPattern count={65} color="bg-emerald-200" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-teal-400/15 blur-3xl" />
    </div>
  );
}

function AkhlaqScene() {
  return (
    <div className="relative h-full w-full bg-gradient-to-b from-[#071a17] via-[#0b2924] to-[#030d0b]">
      <StarsPattern count={45} color="bg-teal-100" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-teal-900/20 to-transparent" />
    </div>
  );
}

function AkhirahScene() {
  return (
    <div className="relative h-full w-full bg-gradient-to-b from-[#0a0c16] via-[#101426] to-[#04050a]">
      <StarsPattern count={75} color="bg-blue-100" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-indigo-400/15 blur-3xl rounded-t-full" />
    </div>
  );
}

function HistoryScene() {
  return (
    <div className="relative h-full w-full bg-gradient-to-b from-[#1c120c] via-[#241910] to-[#0d0805]">
      <StarsPattern count={55} color="bg-amber-100" />
      <div className="absolute bottom-0 inset-x-0 h-48 opacity-60">
        <svg className="w-full h-full text-[#080503]" viewBox="0 0 1000 300" preserveAspectRatio="none" fill="currentColor">
          <path d="M0 300 Q250 180 500 240 Q750 300 1000 160 L1000 300 Z" />
        </svg>
      </div>
    </div>
  );
}

function WomensScene() {
  return (
    <div className="relative h-full w-full bg-gradient-to-b from-[#1d1017] via-[#24161f] to-[#0a0508]">
      <StarsPattern count={40} color="bg-rose-100" />
      <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-rose-500/10 blur-3xl" />
    </div>
  );
}

function StarsPattern({ count, color }: { count: number; color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const top = (i * 17) % 90;
        const left = (i * 23) % 95;
        const size = (i % 3) + 1;
        const opacity = ((i % 5) + 3) / 10;

        return (
          <div
            key={i}
            className={`absolute rounded-full ${color}`}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
}
