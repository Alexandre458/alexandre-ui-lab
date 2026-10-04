"use client";

import { useState } from "react";
const checks = [{ id: "tests", title: "Testes", detail: "Suite da candidata verificada no ambiente fictício." }, { id: "migration", title: "Migração", detail: "Plano de mudança de dados revisado pela equipe fictícia." }];
type Release = { checks: string[]; published: boolean; history: string[] };
const initial: Release = { checks: [], published: false, history: [] };

export default function ContextualActionSoftwareTeam() {
  const [release, setRelease] = useState<Release>(initial);
  const ready = checks.every(check => release.checks.includes(check.id));
  return <section className="revision-demo release-demo" aria-label="Release local"><div className="release-console">
    <header><span className="demo-kicker">RELEASE DESK / 010</span><span className="release-local">● SIMULAÇÃO LOCAL</span><h1>Revisar. Publicar.<br /><em>Poder voltar.</em></h1></header>
    <div className="release-versions"><div><small>Versão atual</small><strong>{release.published ? "2.4.0" : "2.3.0"}</strong></div><span aria-hidden="true">→</span><div><small>Candidata</small><strong>2.4.0</strong></div></div>
    <fieldset className="release-checklist"><legend>Verificações da candidata</legend>{checks.map(check => <label key={check.id}><input type="checkbox" checked={release.checks.includes(check.id)} disabled={release.published} onChange={() => setRelease(current => ({ ...current, checks: current.checks.includes(check.id) ? current.checks.filter(id => id !== check.id) : [...current.checks, check.id] }))} /><span><strong>{check.title}</strong><small>{check.detail}</small></span></label>)}</fieldset>
    <p role="status">{release.published ? "Release 2.4.0 publicada nesta simulação." : ready ? "Candidata pronta para publicação local." : `Pendentes: ${checks.filter(check => !release.checks.includes(check.id)).map(check => check.title).join(" e ")}.`}</p>
    <div className="revision-actions"><button type="button" disabled={!ready || release.published} onClick={() => setRelease(current => !current.published && checks.every(check => current.checks.includes(check.id)) ? { ...current, published: true, history: [...current.history, "Publicado 2.4.0 a partir de 2.3.0"] } : current)}>Publicar localmente</button><button type="button" disabled={!release.published} onClick={() => setRelease(current => current.published ? { ...current, published: false, history: [...current.history, "Revertido 2.4.0 para 2.3.0"] } : current)}>Reverter release</button></div>
    <section className="release-history" aria-label="Histórico da simulação"><h2>Registro de mudanças</h2>{release.history.length === 0 ? <p>Nenhuma transição executada.</p> : <ol>{release.history.map((event, index) => <li key={index}><span>0{index + 1}</span>{event}</li>)}</ol>}</section><button type="button" onClick={() => setRelease(initial)}>Reiniciar release</button><p className="revision-note">Checklist demonstrativo. Não executa build, Git, migração ou deploy real.</p>
  </div></section>;
}
