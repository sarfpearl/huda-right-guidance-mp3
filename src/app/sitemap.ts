import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import {
  getAllBayanSlugs,
  getAllCategorySlugs,
  getAllSpeakerSlugs,
} from "@/lib/data/service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [bayanSlugs, categorySlugs, speakerSlugs] = await Promise.all([
    getAllBayanSlugs(),
    getAllCategorySlugs(),
    getAllSpeakerSlugs(),
  ]);

  const staticRoutes = ["", "/explore", "/categories", "/speakers", "/search"].map(
    (path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: path === "" ? 1 : 0.7,
    })
  );

  const bayanRoutes = bayanSlugs.map((slug) => ({
    url: `${siteConfig.url}/bayan/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryRoutes = categorySlugs.map((slug) => ({
    url: `${siteConfig.url}/category/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const speakerRoutes = speakerSlugs.map((slug) => ({
    url: `${siteConfig.url}/speaker/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...bayanRoutes, ...categoryRoutes, ...speakerRoutes];
}
