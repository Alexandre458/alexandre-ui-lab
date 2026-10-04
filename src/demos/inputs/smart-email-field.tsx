"use client";

import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";

export default function SmartEmailField() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [confirmed, setConfirmed] = useState("");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const [local, domain] = email.trim().split("@");
  const corrections: Record<string, string> = { "gmial.com": "gmail.com", "gamil.com": "gmail.com", "outlok.com": "outlook.com" };
  const suggestion = valid && corrections[domain?.toLowerCase()] ? `${local}@${corrections[domain.toLowerCase()]}` : "";
  const error = touched && email.length > 0 && !valid;
  return <section className="demo-input"><div className="input-showcase"><span className="demo-kicker">FORM / 001</span><h1>Fique por dentro.</h1><p>Revise seu endereço antes de continuar.</p><label htmlFor="demo-email">Seu e-mail</label><div className={`email-box ${error ? "has-error" : ""} ${valid ? "is-valid" : ""}`}><Mail size={18} aria-hidden="true" /><input id="demo-email" type="email" autoComplete="off" placeholder="voce@exemplo.com" value={email} aria-invalid={error} aria-describedby="email-help" onChange={event => { setEmail(event.target.value); setConfirmed(""); }} onBlur={() => setTouched(true)} onKeyDown={event => { if (event.key === "Enter" && valid) setConfirmed(email.trim()); }} />{valid && <CheckCircle2 size={19} aria-hidden="true" />}</div><p id="email-help" className={`field-help ${error ? "error" : ""}`}>{error ? "Confira o formato do e-mail." : valid ? "Perfeito! E-mail pronto para continuar." : "Use um endereço válido para continuar."}</p>{suggestion && <aside className="email-suggestion"><p>Você quis dizer <strong>{suggestion}</strong>?</p><button type="button" onClick={() => { setEmail(suggestion); setConfirmed(""); }}>Aplicar sugestão</button><small>Você também pode manter o endereço original.</small></aside>}<button type="button" disabled={!valid} onClick={() => setConfirmed(email.trim())}>Continuar →</button><p role="status" className="email-result">{confirmed && `Endereço revisado: ${confirmed}`}</p><small>Demonstração interativa. Nenhum dado é enviado.</small></div></section>;
}
