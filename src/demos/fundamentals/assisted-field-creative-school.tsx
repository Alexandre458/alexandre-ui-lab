"use client";

import { useState } from "react";
const tracks = ["Ilustração", "Motion Design", "Fotografia", "Design Sonoro", "Escrita Criativa"];

export default function AssistedFieldCreativeSchool() {
  const [name, setName] = useState(""); const [track, setTrack] = useState(""); const [frequency, setFrequency] = useState(2); const [goal, setGoal] = useState(4); const [confirmed, setConfirmed] = useState(false);
  const capacity = 6 * frequency / 2;
  const ready = name.trim().length >= 3 && tracks.includes(track) && goal <= capacity;
  return <section className="revision-demo study-demo" aria-label="Planejamento de estudos"><div className="study-planner">
    <header><span className="demo-kicker">ESCOLA CRIATIVA / 016</span><h1>Uma meta que<br /><em>cabe na semana.</em></h1><p>Seis semanas para praticar. Cada módulo precisa de duas aulas.</p></header>
    <div className="study-layout"><div><fieldset className="study-identification" disabled={confirmed}><legend>Seu plano fictício</legend><label>Nome do estudante<input value={name} maxLength={80} onChange={event => setName(event.target.value)} /></label><label>Trilha de aulas<select value={track} onChange={event => setTrack(event.target.value)}><option value="">Escolha uma trilha</option>{tracks.map(item => <option key={item}>{item}</option>)}</select></label><fieldset className="study-frequency"><legend>Frequência</legend>{[1, 2, 3].map(value => <label key={value}><input type="radio" name="study-frequency" checked={frequency === value} onChange={() => setFrequency(value)} />{value} {value === 1 ? "aula" : "aulas"}/semana</label>)}</fieldset></fieldset>
      <div className="study-calendar" role="img" aria-label={`6 semanas com ${frequency} aulas cada, total ${6 * frequency} aulas`}>{Array.from({ length: 6 }, (_, index) => <div key={index} aria-hidden="true"><small>SEM {index + 1}</small>{Array.from({ length: frequency }, (_, lesson) => <span key={lesson}>Aula {lesson + 1}</span>)}</div>)}</div></div>
      <aside className="study-goal"><label htmlFor="study-goal-input">Meta de módulos</label><input id="study-goal-input" type="range" min={1} max={12} value={goal} disabled={confirmed} aria-describedby="study-capacity" onChange={event => setGoal(Number(event.target.value))} /><strong>{goal} módulos</strong><p id="study-capacity">{6} semanas × {frequency} aulas ÷ 2 = capacidade de {capacity} módulos.</p><p role="status">{confirmed ? `Plano registrado: ${name.trim()} · ${track} · ${goal} módulos.` : goal > capacity ? `Meta incompatível: ${goal - capacity} módulos acima da capacidade.` : `Meta viável · ${capacity - goal} módulos de folga.`}</p>{goal > capacity && <button type="button" onClick={() => setGoal(capacity)}>Ajustar à capacidade</button>}{confirmed ? <button type="button" onClick={() => setConfirmed(false)}>Revisar plano</button> : <button type="button" disabled={!ready} onClick={() => { if (ready) setConfirmed(true); }}>Confirmar plano</button>}<button type="button" onClick={() => { setName(""); setTrack(""); setFrequency(2); setGoal(4); setConfirmed(false); }}>Reiniciar plano</button></aside>
    </div><p className="revision-note">Planejamento local; não efetua matrícula nem inscrição em cursos.</p>
  </div></section>;
}
