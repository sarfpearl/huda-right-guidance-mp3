import type { Metadata } from "next";
import { getCategories, getAllBayan, getSpeakers } from "@/lib/data/service";
import { ImmersiveHomeClient } from "@/components/home/ImmersiveHomeClient";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Huda Bayan · Immersive Islamic Bayan Experience",
  description:
    "An immersive Islamic Bayan experience. Listen to talks on Iman, Qur'an, Salah, Dua, and guidance in Tamil.",
  alternates: { canonical: absoluteUrl("/") },
};

export default async function HomePage() {
  const [categories, allBayan, speakers] = await Promise.all([
    getCategories(),
    getAllBayan("latest"),
    getSpeakers(),
  ]);

  return (
    <ImmersiveHomeClient
      categories={categories}
      allBayan={allBayan}
      speakers={speakers}
    />
  );
}
