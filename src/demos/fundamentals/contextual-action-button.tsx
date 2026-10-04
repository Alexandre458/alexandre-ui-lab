"use client";

import { useState } from "react";
import { Check, Palette, Undo2 } from "lucide-react";

const exercises = [
  { id: "palette", title: "Preparar paleta", instruction: "Escolha três cores e faça uma escala de cinco valores." },
  { id: "light", title: "Estudo de luz", instruction: "Observe um objeto e desenhe a direção da sombra." },
  { id: "composition", title: "Composição final", instruction: "Combine sua paleta e o estudo em uma pequena pintura." },
];

export default function ContextualActionButton() {
  const [completed, setCompleted] = useState(0);
  return <section className="revision-demo practice-demo" aria-label="Caderno de prática">
    <div className="practice-notebook"><header><span className="demo-kicker">OFICINA / 006</span><Palette aria-hidden="true" /><h1>Um estudo.<br /><em>Um passo de cada vez.</em></h1><p>Marque o que você praticou. O próximo exercício usa o anterior.</p></header>
      <ol className="practice-exercises">{exercises.map((exercise, index) => <li key={exercise.id} className={index < completed ? "is-complete" : ""}>
        <span className="practice-number" aria-hidden="true">0{index + 1}</span><div><h2>{exercise.title}</h2><p>{exercise.instruction}</p><small>{index === 0 ? "Primeiro exercício da sequência" : `Pré-requisito: ${exercises[index - 1].title}`}</small></div>
        <button type="button" disabled={index > completed} onClick={() => setCompleted(current => index < current ? index : index === current ? current + 1 : current)} aria-label={`${index < completed ? "Reabrir" : "Concluir"} ${exercise.title}`}>{index < completed ? <Undo2 size={16} aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}{index < completed ? "Reabrir" : index > completed ? "Bloqueado" : "Concluir"}</button>
      </li>)}</ol>
      <footer className="practice-footer"><p role="status">{completed} de 3 exercícios concluídos{completed === 3 ? " · Estudo completo!" : ""}</p><button type="button" onClick={() => setCompleted(0)}>Reiniciar prática</button></footer>
      <p className="revision-note">Seu caderno é local. Reabrir um exercício também reabre os que dependem dele.</p>
    </div>
  </section>;
}
