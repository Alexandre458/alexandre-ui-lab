"use client";

import { useState } from "react";
const seats = ["A", "B"].flatMap(row => Array.from({ length: 6 }, (_, index) => `${row}${index + 1}`));
const occupied = new Set(["A2", "B4"]);
const money = (amount: number) => amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function ContextualActionCulturalProducer() {
  const [selection, setSelection] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  function toggle(seat: string) {
    if (occupied.has(seat) || confirmed) return;
    setSelection(current => current.includes(seat) ? current.filter(item => item !== seat) : current.length < 3 ? [...current, seat].sort() : current);
  }
  return <section className="revision-demo seats-demo" aria-label="Mapa de assentos"><div className="seats-poster">
    <header><span className="demo-kicker">CENA ABERTA / 009</span><h1>Seu lugar<br /><em>na história.</em></h1><p>Sessão fictícia · 18 out 2026 · 19h30 · R$ 35 por lugar</p></header>
    <div className="seats-layout"><div className="seats-auditorium"><div className="seats-stage">PALCO</div><div className="seats-grid" role="group" aria-label="Fileiras A e B">{seats.map(seat => <button key={seat} type="button" aria-label={`Assento ${seat}${occupied.has(seat) ? " ocupado" : ""}`} aria-pressed={selection.includes(seat)} disabled={confirmed || occupied.has(seat) || selection.length === 3 && !selection.includes(seat)} onClick={() => toggle(seat)} className={occupied.has(seat) ? "occupied" : selection.includes(seat) ? "selected" : ""}>{seat}{occupied.has(seat) ? " ×" : selection.includes(seat) ? " ✓" : ""}</button>)}</div><p className="seats-legend">Livre: contorno · Selecionado: ✓ · Ocupado: ×</p><p>Até 3 assentos. Desmarque um para escolher outro.</p></div>
      <aside className="seats-ticket"><h2>{confirmed ? "Reserva local confirmada" : "Escolha seus lugares"}</h2><p role="status">{selection.length === 0 ? "Nenhum lugar selecionado" : selection.join(" · ")}</p><p>{selection.length} lugares × R$ 35</p><strong>{money(selection.length * 35)}</strong>{confirmed ? <button type="button" onClick={() => setConfirmed(false)}>Revisar reserva</button> : <button type="button" disabled={selection.length === 0} onClick={() => { if (selection.length > 0) setConfirmed(true); }}>Confirmar lugares</button>}<button type="button" onClick={() => { setSelection([]); setConfirmed(false); }}>Reiniciar escolha</button><p className="revision-note">Reserva cenográfica. Nenhum lugar é bloqueado fora desta tela.</p></aside>
    </div>
  </div></section>;
}
