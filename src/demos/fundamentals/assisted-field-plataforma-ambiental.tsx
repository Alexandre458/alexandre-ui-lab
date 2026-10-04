"use client";

import { useEffect, useRef, useState } from "react";
import { decimal, parseDecimal } from "./local-values";
const initiatives = [{ id: "aguas", title: "Águas Reutilizadas", unit: "litros", target: 1200000 }, { id: "floresta", title: "Recuperação Florestal", unit: "árvores", target: 32000 }, { id: "energia", title: "Eficiência Energética", unit: "MWh", target: 540 }, { id: "residuos", title: "Resíduos Orgânicos", unit: "toneladas", target: 340 }];

export default function AssistedFieldPlataformaAmbiental() {
  const [initiativeId, setInitiativeId] = useState(""); const [rawValue, setRawValue] = useState(""); const [phase, setPhase] = useState("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null); const result = useRef<HTMLDivElement>(null); const selector = useRef<HTMLSelectElement>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { if (phase === "success") result.current?.focus(); }, [phase]);
  const initiative = initiatives.find(item => item.id === initiativeId); const value = parseDecimal(rawValue);
  const valid = Boolean(initiative) && value !== null && value > 0 && value <= initiative!.target && (initiative!.id !== "floresta" || Number.isInteger(value));
  const percent = valid ? value! / initiative!.target * 100 : 0;
  const locked = phase !== "idle";
  function save() {
    if (!valid || locked || timer.current) return;
    setPhase("loading"); timer.current = setTimeout(() => setPhase("success"), 500);
  }
  function reset() { if (timer.current) clearTimeout(timer.current); timer.current = null; setPhase("idle"); setInitiativeId(""); setRawValue(""); requestAnimationFrame(() => selector.current?.focus()); }
  return <section className="revision-demo reading-meter-demo" aria-label="Registro ambiental"><div className="reading-meter">
    <header><span className="demo-kicker">CADERNO AMBIENTAL / 018</span><h1>Uma leitura.<br /><em>A unidade certa.</em></h1><p>Registre o acumulado e compare com a meta anual fictícia.</p></header>
    <div className="meter-layout"><div className="meter-entry"><label htmlFor="meter-initiative">Iniciativa acompanhada</label><select id="meter-initiative" ref={selector} value={initiativeId} disabled={locked} onChange={event => { setInitiativeId(event.target.value); setRawValue(""); }}>{<option value="">Escolha uma iniciativa</option>}{initiatives.map(item => <option key={item.id} value={item.id}>{item.title} — {item.unit}</option>)}</select><label htmlFor="meter-value">Valor acumulado {initiative ? `(${initiative.unit})` : ""}</label><input id="meter-value" value={rawValue} inputMode="decimal" disabled={!initiative || locked} aria-invalid={rawValue !== "" && !valid} aria-describedby="meter-help" onChange={event => setRawValue(event.target.value)} onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); save(); } }} /><p id="meter-help">{!initiative ? "Selecione a unidade antes de registrar." : `Maior que zero e até ${decimal(initiative.target)} ${initiative.unit}.${initiative.id === "floresta" ? " Árvores exigem unidades inteiras." : " Aceita decimal com vírgula ou ponto, sem separador de milhar."}`}</p><button type="button" disabled={!valid || locked} onClick={save}>{phase === "loading" ? "Guardando leitura…" : "Guardar leitura"}</button></div>
      <div className="meter-scale"><span>ATINGIMENTO DA META</span><strong>{valid ? `${decimal(percent)}%` : "—"}</strong><div className="meter-track" role="meter" aria-label="Percentual da meta anual" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-valuetext={valid ? `${decimal(percent)}% da meta` : "Leitura indisponível"}><div style={{ height: `${percent}%` }} /></div><p>{initiative ? `Meta: ${decimal(initiative.target)} ${initiative.unit}` : "Aguardando iniciativa"}</p></div>
    </div><div className="meter-result" ref={result} tabIndex={-1} role="status">{phase === "success" ? `Leitura local ${initiativeId.toUpperCase()}-${String(Math.round(value! * 10)).padStart(4, "0")}: ${decimal(value!)} ${initiative!.unit} · ${decimal(percent)}% da meta.` : rawValue && !valid ? "Leitura inválida. Confira unidade, formato e limite." : phase === "loading" ? "Validando leitura local…" : "Nenhuma leitura confirmada."}</div><button type="button" onClick={reset}>Novo registro</button><p className="revision-note">A troca de iniciativa limpa a leitura. Nenhum serviço recebe estes dados.</p>
  </div></section>;
}
