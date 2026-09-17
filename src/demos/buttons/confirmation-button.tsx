"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";

export default function ConfirmationButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function activate() { if (status === "loading") return; setStatus("loading"); timer.current = setTimeout(() => setStatus("done"), 800); }
  return <section className="demo-button"><div className="button-showcase"><span className="demo-kicker">MICROINTERACTION / 001</span><h1>Uma ação clara.<br /><em>Um retorno imediato.</em></h1><p>Um botão que comunica cada etapa, do clique à confirmação.</p><button type="button" onClick={activate} disabled={status === "loading"} className={`confirm-action ${status === "done" ? "is-done" : ""}`}>{status === "loading" ? <><LoaderCircle className="spin" size={19} aria-hidden="true" /> Processando</> : status === "done" ? <><Check size={19} aria-hidden="true" /> Confirmado</> : <>Confirmar ação <ArrowRight size={18} aria-hidden="true" /></>}</button><p className="demo-note" role="status" aria-live="polite">{status === "done" ? "Tudo certo. Clique novamente para testar." : "Clique para experimentar o feedback."}</p></div></section>;
}
