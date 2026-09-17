"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Layers3 } from "lucide-react";

export default function WorkspaceLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setMessage("Acesso simulado com sucesso. Nenhuma credencial foi enviada ou salva."); event.currentTarget.reset(); }
  return <section className="demo-login"><div className="login-story"><div className="login-logo"><Layers3 size={21} /> orbit<span>.</span></div><div><span className="demo-kicker">SEU ESPAÇO CRIATIVO</span><h1>O melhor trabalho começa quando tudo se conecta.</h1><p>Um espaço calmo para organizar ideias, colaborar e seguir em frente.</p></div><span>© 2026 Orbit Workspace</span></div><div className="login-form-side"><div className="login-panel"><span className="demo-kicker">BEM-VINDO DE VOLTA</span><h2>Entre no seu espaço</h2><p>Use qualquer e-mail válido para testar esta interface.</p><form onSubmit={handleSubmit}><label htmlFor="login-email">E-mail</label><input id="login-email" type="email" required autoComplete="off" placeholder="voce@empresa.com" /><label htmlFor="login-password">Senha de teste</label><div className="password-box"><input id="login-password" type={showPassword ? "text" : "password"} required minLength={4} autoComplete="off" placeholder="Mínimo de 4 caracteres" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div><button className="login-submit" type="submit">Entrar no workspace <ArrowRight size={18} /></button></form><p role="status" aria-live="polite" className="login-message">{message || "Esta é uma demonstração. Nenhum login real acontece."}</p></div></div></section>;
}
