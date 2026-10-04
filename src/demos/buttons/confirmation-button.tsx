"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";

export default function ConfirmationButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function activate() { if (status !== "idle" || timer.current) return; setStatus("loading"); timer.current = setTimeout(() => setStatus("done"), 800); }
  return <section className="demo-button"><div className="button-showcase"><span className="demo-kicker">MICROINTERACTION / 001</span><h1>Uma ação clara.<br /><em>Um retorno imediato.</em></h1><p>Um botão que comunica cada etapa, do clique à confirmação.</p><button id="confirm-primary" type="button" onClick={activate} disabled={status !== "idle"} className={`confirm-action ${status === "done" ? "is-done" : ""}`}>{status === "loading" ? <><LoaderCircle className="spin" size={19} aria-hidden="true" /> Processando</> : status === "done" ? <><Check size={19} aria-hidden="true" /> Confirmado</> : <>Confirmar ação <ArrowRight size={18} aria-hidden="true" /></>}</button><p className="demo-note" role="status" aria-live="polite">{status === "done" ? "Ação confirmada uma vez. Você pode desfazer." : "Clique para experimentar o feedback."}</p>{status === "done" && <button type="button" className="revision-undo" onClick={() => { timer.current = null; setStatus("idle"); requestAnimationFrame(() => document.getElementById("confirm-primary")?.focus()); }}>Desfazer confirmação</button>}</div></section>;
}
