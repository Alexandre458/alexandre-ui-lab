"use client";

import { useState } from "react";
const days = [
  { id: "2026-10-05", label: "05 out · Segunda", slots: [{ time: "09:00", busy: true }, { time: "10:00", busy: false }, { time: "14:00", busy: false }] },
  { id: "2026-10-06", label: "06 out · Terça", slots: [{ time: "09:00", busy: false }, { time: "10:00", busy: true }] },
];

export default function AssistedFieldPreventiveClinic() {
  const [name, setName] = useState(""); const [dayId, setDayId] = useState(days[0].id);
  const [slot, setSlot] = useState(""); const [confirmed, setConfirmed] = useState(false);
  const day = days.find(item => item.id === dayId)!;
  const validName = name.trim().split(/\s+/).length >= 2 && /^[\p{L} '\-]+$/u.test(name.trim());
  const ready = validName && day.slots.some(item => item.time === slot && !item.busy);
  return <section className="revision-demo appointment-demo" aria-label="Agenda preventiva fictícia"><div className="appointment-board">
    <header><span className="demo-kicker">AGENDA PREVENTIVA / 011</span><h1>Escolha um tempo<br /><em>para conversar.</em></h1><p>Uma agenda de demonstração, com horários disponíveis e ocupados.</p></header>
    <div className="appointment-layout"><div><fieldset className="appointment-days"><legend>Dias disponíveis · Outubro de 2026</legend>{days.map(item => <label key={item.id}><input type="radio" name="appointment-day" checked={dayId === item.id} disabled={confirmed} onChange={() => { setDayId(item.id); setSlot(""); setConfirmed(false); }} />{item.label}</label>)}</fieldset>
      <fieldset className="appointment-slots"><legend>Horários de {day.label}</legend>{day.slots.map(item => <label key={item.time} className={item.busy ? "busy" : ""}><input type="radio" name="appointment-slot" value={item.time} checked={slot === item.time} disabled={item.busy || confirmed} onChange={() => setSlot(item.time)} />{item.time}<small>{item.busy ? "Ocupado" : "Disponível"}</small></label>)}</fieldset></div>
      <aside className="appointment-summary"><label htmlFor="appointment-name">Nome fictício completo</label><input id="appointment-name" value={name} maxLength={80} disabled={confirmed} aria-describedby="appointment-name-help" aria-invalid={name !== "" && !validName} onChange={event => { setName(event.target.value); setConfirmed(false); }} onKeyDown={event => { if (event.key === "Enter" && ready) { event.preventDefault(); setConfirmed(true); } }} /><p id="appointment-name-help">Informe nome e sobrenome fictícios.</p><h2>{confirmed ? "Horário confirmado localmente" : "Resumo do agendamento"}</h2><p>{day.label}</p><strong>{slot || "Escolha um horário livre"}</strong><p role="status">{confirmed ? `${name.trim()} · ${day.label} · ${slot}` : "Mudar o dia limpa o horário escolhido."}</p>{confirmed ? <button type="button" onClick={() => setConfirmed(false)}>Revisar agendamento</button> : <button type="button" disabled={!ready} onClick={() => { if (ready) setConfirmed(true); }}>Confirmar agendamento</button>}<button type="button" onClick={() => { setName(""); setDayId(days[0].id); setSlot(""); setConfirmed(false); }}>Reiniciar agenda</button></aside>
    </div><p className="revision-note">Nenhuma consulta é marcada. Datas fixas, dados fictícios e nenhuma informação médica.</p>
  </div></section>;
}
