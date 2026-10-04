"use client";

import { useState } from "react";
type Reading = { title: string; author: string; rating: number; notes: string; spoiler: boolean };
const initial: Reading = { title: "", author: "", rating: 0, notes: "", spoiler: false };

export default function AssistedFieldReadingCommunity() {
  const [draft, setDraft] = useState<Reading>(initial); const [saved, setSaved] = useState<Reading | null>(null); const [revealed, setRevealed] = useState(false);
  const ready = draft.title.trim().length >= 3 && draft.author.trim().length >= 3 && draft.rating >= 1 && draft.rating <= 5 && draft.notes.trim().length >= 20 && draft.notes.length <= 500;
  function update<K extends keyof Reading>(key: K, value: Reading[K]) { setDraft(current => ({ ...current, [key]: value })); }
  return <section className="revision-demo reading-diary" aria-label="Diário de leitura"><div className="reading-page"><div className="reading-spine" aria-hidden="true">CADERNO DE LEITURA · 014</div><div className="reading-writing">
    <header><span className="demo-kicker">LEITURAS QUE FICAM</span><h1>Entre linhas,<br /><em>seu olhar.</em></h1></header>
    {saved ? <article className="reading-entry"><h2>{saved.title}</h2><p>por {saved.author}</p><p aria-label={`${saved.rating} de 5 estrelas`}>{"★".repeat(saved.rating)}{"☆".repeat(5 - saved.rating)}</p><p role="status">Ficha registrada localmente{saved.spoiler ? " · Contém spoiler" : ""}.</p>{saved.spoiler && <button type="button" aria-expanded={revealed} aria-controls="reading-saved-notes" onClick={() => setRevealed(!revealed)}>{revealed ? "Recolher anotação" : "Revelar anotação"}</button>}<blockquote id="reading-saved-notes" hidden={saved.spoiler && !revealed}>{saved.notes}</blockquote><button type="button" onClick={() => { setSaved(null); setRevealed(false); }}>Editar ficha</button></article> : <div className="reading-fields">
      <label>Título do livro<input value={draft.title} maxLength={100} onChange={event => update("title", event.target.value)} /></label><label>Autor<input value={draft.author} maxLength={80} onChange={event => update("author", event.target.value)} /></label>
      <fieldset className="reading-stars"><legend>Sua avaliação</legend>{[1, 2, 3, 4, 5].map(star => <label key={star}><input type="radio" name="reading-rating" checked={draft.rating === star} onChange={() => update("rating", star)} aria-label={`${star} ${star === 1 ? "estrela" : "estrelas"}`} /><span aria-hidden="true">{star} ★</span></label>)}</fieldset>
      <label>Anotações<textarea value={draft.notes} maxLength={500} rows={4} aria-describedby="reading-notes-help" onChange={event => update("notes", event.target.value)} /></label><p id="reading-notes-help">{draft.notes.length}/500 caracteres · Mínimo 20.</p><label className="reading-spoiler"><input type="checkbox" checked={draft.spoiler} onChange={event => update("spoiler", event.target.checked)} />Contém spoiler</label><button type="button" disabled={!ready} onClick={() => { if (ready) { setSaved({ ...draft, title: draft.title.trim(), author: draft.author.trim(), notes: draft.notes.trim() }); setRevealed(false); } }}>Registrar ficha</button>
    </div>}
    <button type="button" onClick={() => { setDraft(initial); setSaved(null); setRevealed(false); }}>Nova ficha</button><p className="revision-note">Um diário só desta sessão. Nenhuma anotação é compartilhada.</p>
  </div></div></section>;
}
