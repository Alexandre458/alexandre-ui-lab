import type { MetadataRoute } from "next";
import { entries, categories } from "@/registry/entries";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ui.alexandresilva.dev";
  return [{ url: base, priority: 1 }, ...categories.map(category => ({ url: `${base}/category/${category.slug}/`, priority: 0.8 })), ...entries.map(entry => ({ url: `${base}/${entry.category}/${entry.slug}/`, priority: 0.7 }))];
}
