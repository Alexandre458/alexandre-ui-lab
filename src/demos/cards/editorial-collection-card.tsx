"use client";

import { useState } from "react";
import { ArrowUpRight, Heart } from "lucide-react";

export default function EditorialCollectionCard() {
  const [saved, setSaved] = useState(false);
  return <section className="demo-card"><div className="editorial-card"><div className="editorial-art"><span>OBJECTS<br />OF<br />QUIET</span><i className="shape-one" /><i className="shape-two" /></div><div className="editorial-copy"><div className="editorial-top"><span>EDIÇÃO 01 / 2026</span><button type="button" aria-pressed={saved} aria-label={saved ? "Remover da coleção" : "Salvar na coleção"} onClick={() => setSaved(!saved)}><Heart size={19} fill={saved ? "currentColor" : "none"} /></button></div><div><span className="demo-kicker">CURADORIA DE DESIGN</span><h1>A beleza do<br /><em>essencial.</em></h1><p>Objetos cotidianos, formas honestas e uma pausa para observar.</p><span className="editorial-link">Explore a coleção <ArrowUpRight size={17} aria-hidden="true" /></span></div><p className="demo-note" role="status">{saved ? "Salvo na sua coleção desta sessão." : "Toque no coração para salvar."}</p></div></div></section>;
}
