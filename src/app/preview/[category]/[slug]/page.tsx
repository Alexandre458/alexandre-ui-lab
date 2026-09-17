import { notFound } from "next/navigation";
import { entries, getEntry } from "@/registry/entries";
import { PreviewDemo } from "@/components/lab/preview-demo";
import "@/demos/demos.css";

export function generateStaticParams() { return entries.map(entry => ({ category: entry.category, slug: entry.slug })); }
export default async function PreviewPage({ params }: { params: Promise<{ category: string; slug: string }> }) { const { category, slug } = await params; const entry = getEntry(category, slug); if (!entry) notFound(); return <div className="demo-stage"><PreviewDemo id={entry.id} /></div>; }
