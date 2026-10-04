"use client";

import { useState } from "react";
import { decimal, parseDecimal } from "./local-values";
const rooms = [{ id: "living", title: "Sala", initial: "30" }, { id: "bedroom", title: "Quartos", initial: "40" }, { id: "circulation", title: "Circulação", initial: "15" }];
const initial = Object.fromEntries(rooms.map(room => [room.id, room.initial]));
const parseArea = (raw: string) => /^\d+(?:[,.]\d)?$/.test(raw.trim()) ? parseDecimal(raw) : null;

export default function AssistedFieldArchitectureStudio() {
  const [capacity, setCapacity] = useState("100"); const [areas, setAreas] = useState<Record<string, string>>(initial);
  const [saved, setSaved] = useState(false);
  const limit = parseArea(capacity); const values = rooms.map(room => parseArea(areas[room.id]));
  const valid = limit !== null && limit > 0 && limit <= 10000 && values.every(value => value !== null && value > 0 && value <= 10000);
  const totalTenths = valid ? values.reduce<number>((sum, value) => sum + Math.round(value! * 10), 0) : 0;
  const total = totalTenths / 10;
  const remaining = valid ? (Math.round(limit! * 10) - totalTenths) / 10 : 0;
  const ready = valid && remaining >= 0;
  return <section className="revision-demo area-demo" aria-label="Programa de ambientes"><div className="area-blueprint">
    <header><span className="demo-kicker">PROGRAMA ESPACIAL / 012</span><h1>Cada metro<br /><em>tem um lugar.</em></h1><p>Distribua a área disponível entre os ambientes do seu estudo.</p></header>
    <div className="area-layout"><div><label htmlFor="area-capacity">Área disponível (m²)</label><input id="area-capacity" inputMode="decimal" value={capacity} aria-describedby="area-help" onChange={event => { setCapacity(event.target.value); setSaved(false); }} /><div className="area-diagram" role="img" aria-label={valid ? `Diagrama de ${decimal(total)} metros quadrados: ${rooms.map((room, index) => `${room.title} ${decimal(values[index]!)}`).join(", ")}` : "Diagrama indisponível: corrija as áreas"}>{valid && rooms.map((room, index) => <div key={room.id} style={{ flexGrow: values[index]! }}><span>{room.title}</span><strong>{decimal(values[index]!)} m²</strong></div>)}</div><p id="area-help">Diagrama proporcional de áreas, sem escala de planta executiva. Valores positivos até 10.000 m², com até uma casa decimal.</p></div>
      <aside className="area-schedule"><h2>Quadro de áreas</h2>{rooms.map(room => <label key={room.id} htmlFor={`area-${room.id}`}>{room.title} (m²)<input id={`area-${room.id}`} inputMode="decimal" value={areas[room.id]} onChange={event => { setAreas(current => ({ ...current, [room.id]: event.target.value })); setSaved(false); }} aria-describedby="area-result" /></label>)}<div className={`area-balance ${valid && remaining < 0 ? "over-budget" : ""}`} id="area-result" role="status">{!valid ? "Corrija as áreas: valores finitos e positivos." : <><strong>{decimal(total)} m² alocados</strong><p>{remaining >= 0 ? `${decimal(remaining)} m² livres` : `${decimal(-remaining)} m² de excesso`}</p>{saved && <p>Programa salvo localmente.</p>}</>}</div><button type="button" disabled={!ready || saved} onClick={() => { if (ready) setSaved(true); }}>Salvar programa</button><button type="button" onClick={() => { setCapacity("100"); setAreas(initial); setSaved(false); }}>Reiniciar programa</button></aside>
    </div>
  </div></section>;
}
