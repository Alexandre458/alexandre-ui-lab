"use client";

import { useState } from "react";
const periods = [{ id: "september", name: "Setembro", tonnes: 120, units: 1000 }, { id: "october", name: "Outubro", tonnes: 132, units: 1200 }, { id: "november", name: "Novembro", tonnes: 15, units: 0 }];
const decimal = (value: number) => value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

export default function ContextualActionEnvironmental() {
  const [basis, setBasis] = useState("total");
  const [comparisonId, setComparisonId] = useState("october");
  const current = periods.find(period => period.id === comparisonId)!;
  const base = periods[0];
  const value = (period: typeof base) => basis === "total" ? period.tonnes : period.units === 0 ? null : period.tonnes * 1000 / period.units;
  const before = value(base)!; const after = value(current);
  const change = after === null ? null : (after / before - 1) * 100;
  const unit = basis === "total" ? "t CO₂e" : "kg CO₂e / unidade";
  const maximum = Math.max(before, after ?? 0);
  return <section className="revision-demo emissions-demo" aria-label="Comparador de emissões"><div className="emissions-sheet">
    <header><span className="demo-kicker">OBSERVATÓRIO / 008 · 2026</span><h1>Mais produção.<br /><em>Qual é a base?</em></h1><p>O volume total e a intensidade contam histórias diferentes.</p></header>
    <div className="emissions-controls"><fieldset><legend>Base de comparação</legend>{[{ id: "total", label: "Total" }, { id: "intensity", label: "Por unidade" }].map(option => <label key={option.id}><input type="radio" name="emissions-basis" checked={basis === option.id} onChange={() => setBasis(option.id)} />{option.label}</label>)}</fieldset><label>Comparar com<select value={comparisonId} onChange={event => setComparisonId(event.target.value)}>{periods.slice(1).map(period => <option key={period.id} value={period.id}>{period.name}</option>)}</select></label></div>
    <div className="emissions-bars">{[base, current].map(period => { const measure = value(period); return <div key={period.id} className="emissions-row"><span>{period.name}</span><div className="emissions-track"><div style={{ width: `${measure === null ? 0 : measure / maximum * 100}%` }} /></div><strong>{measure === null ? "Indisponível" : `${decimal(measure)} ${unit}`}</strong><small>{decimal(period.tonnes)} t CO₂e · {decimal(period.units)} unidades produzidas</small></div>; })}</div>
    <div className="emissions-verdict" role="status"><strong>{change === null ? "Sem base de produção" : `${change >= 0 ? "+" : ""}${decimal(change)}%`}</strong><p>{change === null ? "Produção zero: a intensidade não pode ser calculada. Consulte o total." : basis === "total" ? "Variação do volume emitido em relação a setembro." : "Variação de emissões por unidade produzida em relação a setembro."}</p></div>
    <p className="revision-note">Intensidade = toneladas × 1.000 ÷ unidades. Dados fictícios; mesma fonte para as duas bases.</p><button type="button" onClick={() => { setBasis("total"); setComparisonId("october"); }}>Reiniciar comparação</button>
  </div></section>;
}
