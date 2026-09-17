import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Catalog } from "@/components/lab/catalog";
import { categories } from "@/registry/entries";

export function generateStaticParams() { return categories.map(category => ({ category: category.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> { const { category } = await params; const item = categories.find(entry => entry.slug === category); return { title: item?.title ?? "Categoria", description: item?.description, alternates: { canonical: `/category/${category}/` } }; }
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; const item = categories.find(entry => entry.slug === category); if (!item) notFound(); return <><div className="shell page-title"><Link className="eyebrow" href="/">← Voltar ao início</Link><h1>{item.title}</h1><p className="muted">{item.description}</p></div><Catalog initialCategory={category} /></>; }
