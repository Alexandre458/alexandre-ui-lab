"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { categories, entries, entryHref, searchEntries, type Entry } from "@/registry/entries";

function Thumb({ kind }: { kind: Entry["thumbnail"] }) {
  return <div className={`card-visual visual-${kind}`} aria-hidden="true">{kind === "button" ? <span className="thumb-button">Confirmar →</span> : kind === "input" ? <span className="thumb-input">nome@exemplo.com</span> : kind === "card" ? <span className="thumb-card"><span>✦ Nova coleção</span><b>Forma &amp; matéria</b><i /></span> : kind === "login" ? <span className="thumb-login"><strong>Welcome back.</strong><i /><i /><i /></span> : <span className="thumb-hero">Ideas become<br />spaces.</span>}</div>;
}

export function DemoCard({ entry }: { entry: Entry }) {
  return <Link className="demo-card" href={entryHref(entry)} aria-label={`Abrir ${entry.id}: ${entry.title}`}><Thumb kind={entry.thumbnail} /><div className="card-info"><div className="card-top"><span>{entry.id}</span><ArrowUpRight size={17} aria-hidden="true" /></div><h3>{entry.title}</h3><p>{entry.description}</p><div className="tag-row"><span className="tag">{categories.find(item => item.slug === entry.category)?.title}</span><span className="tag">{entry.difficulty}</span></div></div></Link>;
}

export function Catalog({ initialCategory = "all" }: { initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const filtered = useMemo(() => searchEntries(query, category), [query, category]);
  return <section id="catalogo" className="catalog shell" aria-labelledby="catalog-title"><div className="section-heading"><div><span className="eyebrow">Biblioteca em construção</span><h2 id="catalog-title">Explore o catálogo</h2><p className="muted">Interfaces reais para testar em qualquer tela.</p></div><span className="pill">{entries.length} exemplos disponíveis</span></div><label className="sr-only" htmlFor="catalog-search">Buscar exemplos</label><div style={{ position: "relative" }}><Search aria-hidden="true" size={19} style={{ position: "absolute", left: 16, top: 15, color: "#8994aa" }} /><input id="catalog-search" className="search" style={{ paddingLeft: 46 }} value={query} onChange={event => setQuery(event.target.value)} placeholder="Busque por nome, ID, categoria ou tag..." type="search" /></div><div className="filters" role="group" aria-label="Filtrar por categoria"><button type="button" className={`filter ${category === "all" ? "active" : ""}`} onClick={() => setCategory("all")} aria-pressed={category === "all"}>Todos</button>{categories.map(item => <button key={item.slug} type="button" className={`filter ${category === item.slug ? "active" : ""}`} onClick={() => setCategory(item.slug)} aria-pressed={category === item.slug}>{item.title}</button>)}</div><div aria-live="polite" className="sr-only">{filtered.length} resultados</div>{filtered.length ? <div className="card-grid">{filtered.map(entry => <DemoCard entry={entry} key={entry.id} />)}</div> : <p className="muted">Nenhum exemplo encontrado. Tente outro termo ou categoria.</p>}</section>;
}
