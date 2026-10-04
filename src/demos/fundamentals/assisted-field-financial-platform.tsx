"use client";

import { useRef, useState } from "react";
import { money, parseMoney } from "./local-values";
type Transaction = { id: number; description: string; cents: number; kind: string; reversed: boolean };

export default function AssistedFieldFinancialPlatform() {
  const [description, setDescription] = useState(""); const [amount, setAmount] = useState(""); const [kind, setKind] = useState("income");
  const [transactions, setTransactions] = useState<Transaction[]>([]); const nextId = useRef(1);
  const cents = parseMoney(amount); const ready = description.trim().length >= 3 && cents !== null;
  const balance = transactions.reduce((sum, item) => item.reversed ? sum : sum + (item.kind === "income" ? item.cents : -item.cents), 100000);
  function add() {
    if (!ready || cents === null) return;
    const entry: Transaction = { id: nextId.current++, description: description.trim(), cents, kind, reversed: false };
    setTransactions(current => [...current, entry]); setDescription(""); setAmount("");
  }
  return <section className="revision-demo ledger-demo" aria-label="Livro-caixa fictício"><div className="ledger-book">
    <header><span className="demo-kicker">LIVRO-CAIXA / 013</span><h1>O saldo conta<br /><em>uma sequência.</em></h1><div className="ledger-balance" role="status"><small>Saldo atual · base R$ 1.000,00</small><strong>{money(balance / 100)}</strong></div></header>
    <fieldset className="ledger-draft" onKeyDown={event => { if (event.key === "Enter" && event.target instanceof HTMLInputElement) { event.preventDefault(); add(); } }}><legend>Novo lançamento fictício</legend><label>Descrição<input value={description} maxLength={80} onChange={event => setDescription(event.target.value)} /></label><label>Valor (R$)<input value={amount} inputMode="decimal" placeholder="250,50" aria-invalid={amount !== "" && cents === null} aria-describedby="ledger-amount-help" onChange={event => setAmount(event.target.value)} /></label><label>Tipo<select value={kind} onChange={event => setKind(event.target.value)}><option value="income">Receita</option><option value="expense">Despesa</option></select></label><button type="button" disabled={!ready} onClick={add}>Adicionar lançamento</button><p id="ledger-amount-help">Formato brasileiro: 250,50 ou 1.250,50. Até duas casas decimais, maior que zero e até R$ 1.000.000.</p></fieldset>
    <div className="ledger-lines"><div className="ledger-line-head"><span>Descrição / tipo</span><span>Valor / ação</span></div>{transactions.length === 0 ? <p>Nenhum lançamento. Comece com uma receita ou despesa.</p> : <ol>{transactions.map(item => <li key={item.id} className={item.reversed ? "reversed" : ""}><div><strong>{item.description}</strong><small>{item.reversed ? "Estornado" : item.kind === "income" ? "Receita" : "Despesa"} · #{String(item.id).padStart(3, "0")}</small></div><div><strong>{item.kind === "income" ? "+" : "−"}{money(item.cents / 100)}</strong><button type="button" disabled={item.reversed} aria-label={`Estornar ${item.description}`} onClick={() => setTransactions(current => current.map(transaction => transaction.id === item.id ? { ...transaction, reversed: true } : transaction))}>Estornar</button></div></li>)}</ol>}</div>
    <button type="button" onClick={() => { setTransactions([]); setDescription(""); setAmount(""); setKind("income"); nextId.current = 1; }}>Reiniciar livro-caixa</button><p className="revision-note">Sem banco ou movimentação real. Centavos inteiros; estornos permanecem no histórico.</p>
  </div></section>;
}
