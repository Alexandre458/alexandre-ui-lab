"use client";

import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";

export default function SmartEmailField() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const error = touched && email.length > 0 && !valid;
  return <section className="demo-input"><div className="input-showcase"><span className="demo-kicker">FORM / 001</span><h1>Fique por dentro.</h1><p>Novidades com intenção, direto para sua caixa de entrada.</p><label htmlFor="demo-email">Seu e-mail</label><div className={`email-box ${error ? "has-error" : ""} ${valid ? "is-valid" : ""}`}><Mail size={18} aria-hidden="true" /><input id="demo-email" type="email" autoComplete="off" placeholder="voce@exemplo.com" value={email} aria-invalid={error} aria-describedby="email-help" onChange={event => setEmail(event.target.value)} onBlur={() => setTouched(true)} />{valid && <CheckCircle2 size={19} aria-hidden="true" />}</div><p id="email-help" className={`field-help ${error ? "error" : ""}`} role="status">{error ? "Confira o formato do e-mail." : valid ? "Perfeito! E-mail pronto para continuar." : "Use um endereço válido para continuar."}</p><button type="button" disabled={!valid} onClick={() => setTouched(true)}>Continuar →</button><small>Demonstração interativa. Nenhum dado é enviado.</small></div></section>;
}
