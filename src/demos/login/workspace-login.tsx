"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Layers3 } from "lucide-react";

export default function WorkspaceLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const ready = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && password.length >= 4;
  function access() {
    if (!ready) return;
    setMessage("Acesso simulado com sucesso. Nenhuma credencial foi enviada ou salva.");
    setEmail(""); setPassword(""); setShowPassword(false);
  }
  return <section className="demo-login">
    <div className="login-story"><div className="login-logo"><Layers3 size={21} aria-hidden="true" /> orbit<span>.</span></div><div><span className="demo-kicker">SEU ESPAÇO CRIATIVO</span><h1>O melhor trabalho começa quando tudo se conecta.</h1><p>Um espaço calmo para organizar ideias, colaborar e seguir em frente.</p></div><span>© 2026 Orbit Workspace</span></div>
    <div className="login-form-side"><div className="login-panel"><span className="demo-kicker">BEM-VINDO DE VOLTA</span><h2>Entre no seu espaço</h2><p>Use um e-mail fictício e uma senha de teste.</p>
      <form noValidate onSubmit={event => { event.preventDefault(); access(); }} onKeyDown={event => { if (event.key === "Enter" && event.target instanceof HTMLInputElement) { event.preventDefault(); access(); } }}>
        <label htmlFor="login-email">E-mail</label><input id="login-email" type="email" required autoComplete="off" placeholder="voce@empresa.com" value={email} onChange={event => { setEmail(event.target.value); setMessage(""); }} aria-describedby="login-help" />
        <label htmlFor="login-password">Senha de teste</label><div className="password-box"><input id="login-password" type={showPassword ? "text" : "password"} required minLength={4} autoComplete="off" placeholder="Mínimo de 4 caracteres" value={password} onChange={event => { setPassword(event.target.value); setMessage(""); }} aria-describedby="login-help" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-pressed={showPassword} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}</button></div>
        <p id="login-help">E-mail válido e pelo menos 4 caracteres na senha.</p><button className="login-submit" type="button" onClick={access} disabled={!ready}>Entrar no workspace <ArrowRight size={18} aria-hidden="true" /></button>
      </form><p role="status" aria-live="polite" className="login-message">{message || "Esta é uma demonstração. Nenhum login real acontece."}</p>
    </div></div>
  </section>;
}
