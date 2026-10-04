"use client";

import { useState } from "react";
const pieces = [
  { id: "vase", name: "Vaso Alba", material: "Cerâmica · Coleção Terra", stock: 2, price: 289 },
  { id: "lamp", name: "Luminária Arco", material: "Aço · Coleção Luz", stock: 0, price: 1450 },
  { id: "tray", name: "Bandeja Linha", material: "Madeira · Coleção Mesa", stock: 4, price: 96 },
];
const money = (amount: number) => amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function ContextualActionStore() {
  const [reserved, setReserved] = useState<Record<string, number>>({});
  const total = pieces.reduce((sum, piece) => sum + piece.price * (reserved[piece.id] ?? 0), 0);
  function change(id: string, delta: number) {
    const piece = pieces.find(item => item.id === id)!;
    setReserved(current => ({ ...current, [id]: Math.max(0, Math.min(piece.stock, (current[id] ?? 0) + delta)) }));
  }
  return <section className="revision-demo stock-demo" aria-label="Reserva local de peças"><div className="stock-sheet">
    <header><span className="demo-kicker">OBJETOS DISPONÍVEIS / 007</span><h1>Separe sua<br /><em>próxima peça.</em></h1><p>Uma pequena curadoria. Quantidades reais dentro desta simulação.</p></header>
    <div className="stock-layout"><div className="stock-inventory">{pieces.map(piece => { const quantity = reserved[piece.id] ?? 0; return <article key={piece.id}>
      <div className={`piece-art piece-${piece.id}`} aria-hidden="true"><i /></div><div><small>{piece.material}</small><h2>{piece.name}</h2><p>{money(piece.price)} / unidade</p><p className="stock-availability">{piece.stock - quantity > 0 ? `${piece.stock - quantity} unidades disponíveis` : "Esgotado"}</p>
        <div className="revision-actions"><button type="button" disabled={quantity >= piece.stock} onClick={() => change(piece.id, 1)} aria-label={`Reservar ${piece.name}`}>Separar +1</button><button type="button" disabled={quantity === 0} onClick={() => change(piece.id, -1)} aria-label={`Desfazer reserva de ${piece.name}`}>Devolver −1</button></div>
      </div></article>; })}</div>
      <aside className="stock-receipt"><h2>Sua reserva local</h2><ul>{pieces.filter(piece => (reserved[piece.id] ?? 0) > 0).map(piece => <li key={piece.id}>{piece.name}<span>{reserved[piece.id]} × {money(piece.price)}</span></li>)}</ul><p role="status">Subtotal <strong>{money(total)}</strong></p><button type="button" onClick={() => setReserved({})}>Limpar reserva</button><p className="revision-note">Peças separadas apenas nesta tela. Nenhuma compra é realizada.</p></aside>
    </div>
  </div></section>;
}
