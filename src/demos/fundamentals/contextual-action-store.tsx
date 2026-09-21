"use client";

import { useState, useEffect, useRef } from "react";
import { Package, CheckCircle, Clock, RefreshCw, ShoppingBag, Tag } from "lucide-react";

type OrderPhase = "idle" | "processing" | "confirmed";
type Product = { id: number; name: string; collection: string; price: string; badge: string; badgeColor: string };

const products: Product[] = [
  { id: 1, name: "Vaso Cerâmica Orgânica", collection: "Coleção Terra", price: "R$ 289", badge: "Novo", badgeColor: "#7c3aed" },
  { id: 2, name: "Luminária Arco Minimal", collection: "Coleção Luz", price: "R$ 1.450", badge: "Destaque", badgeColor: "#f59e0b" },
  { id: 3, name: "Espelho Oval Gold", collection: "Coleção Reflexo", price: "R$ 890", badge: "Curadoria", badgeColor: "#059669" },
];

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 1000000).toString(36).toUpperCase().padStart(6, "0");
  return `#DSN-${timestamp}-${random.substring(0, 4)}`;
}

export default function ContextualActionStore() {
  const [phase, setPhase] = useState<OrderPhase>("idle");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [progress, setProgress] = useState(0);
  const [orderNumber, setOrderNumber] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  function handleOrder(product: Product) {
    if (phase === "processing") return;
    setSelectedProduct(product);
    setPhase("processing");
    setProgress(0);
    setOrderNumber("");

    timerRef.current = setTimeout(() => {
      setPhase("confirmed");
      setOrderNumber(generateOrderNumber());
      if (progressRef.current) clearInterval(progressRef.current);
    }, 3500);

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (progressRef.current) clearInterval(progressRef.current);
          return 100;
        }
        return prev + 2.85;
      });
    }, 100);
  }

  function handleReset() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setPhase("idle");
    setSelectedProduct(null);
    setProgress(0);
    setOrderNumber("");
  }

  return (
    <section className="demo-store-fundamentals" aria-label="Ação contextual — Loja de Design">
      <div className="store-fundamentals-stage">
        <div className="store-fundamentals-header">
          <span className="demo-kicker">FUNDAMENTOS / 007</span>
          <div className="store-fundamentals-badge-row">
            <Tag size={14} aria-hidden="true" />
            <span>Loja de Design — Curadoria Exclusiva</span>
          </div>
        </div>

        <div className="store-fundamentals-hero">
          <div className="store-fundamentals-hero-content">
            <ShoppingBag size={28} aria-hidden="true" className="store-hero-icon" />
            <h1>
              Peças que contam <em>história</em>.
            </h1>
            <p>
              Cada item é selecionado por curadores especializados. Simule um pedido e receba a confirmação instantânea.
            </p>
          </div>
        </div>

        <div className="store-fundamentals-products">
          <h2>Curadoria do momento</h2>
          <div className="store-fundamentals-product-list">
            {products.map((product) => (
              <article key={product.id} className={`store-fundamentals-product-card ${selectedProduct?.id === product.id ? "is-selected" : ""} ${phase === "confirmed" && selectedProduct?.id === product.id ? "is-ordered" : ""}`}>
                <div className="store-fundamentals-product-info">
                  <div className="store-fundamentals-product-meta">
                    <span className="store-fundamentals-badge" style={{ backgroundColor: product.badgeColor }}>{product.badge}</span>
                    <span className="store-fundamentals-collection">{product.collection}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p className="store-fundamentals-price">{product.price}</p>
                </div>
                <div className="store-fundamentals-product-actions">
                  {phase === "idle" && (
                    <button
                      type="button"
                      onClick={() => handleOrder(product)}
                      className="store-fundamental-action-btn store-fundamental-action-primary"
                      aria-label={`Solicitar pedido de ${product.name}`}
                    >
                      <Package size={17} aria-hidden="true" />
                      <span>Solicitar pedido</span>
                    </button>
                  )}
                  {phase === "processing" && selectedProduct?.id === product.id && (
                    <div className="store-fundamental-action-progress" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label={`Processando pedido de ${product.name}`}>
                      <Clock size={17} aria-hidden="true" className="store-progress-spin" />
                      <span>Processando — {Math.round(progress)}%</span>
                      <div className="store-fundamental-progress-track">
                        <div className="store-fundamental-progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                  {phase === "confirmed" && selectedProduct?.id === product.id && (
                    <div className="store-fundamental-action-success">
                      <CheckCircle size={17} aria-hidden="true" />
                      <span>Pedido confirmado</span>
                      <span className="store-order-number">{orderNumber}</span>
                    </div>
                  )}
                  {phase !== "idle" && selectedProduct?.id !== product.id && phase !== "processing" && (
                    <button
                      type="button"
                      disabled
                      className="store-fundamental-action-btn store-fundamental-action-muted"
                      aria-label={`Produto ${product.name} já solicitado`}
                    >
                      <CheckCircle size={17} aria-hidden="true" />
                      <span>Solicitado</span>
                    </button>
                  )}
                  {phase === "processing" && selectedProduct?.id !== product.id && (
                    <button
                      type="button"
                      disabled
                      className="store-fundamental-action-btn store-fundamental-action-muted"
                      aria-label={`Produto ${product.name} em espera`}
                    >
                      <Clock size={17} aria-hidden="true" />
                      <span>Em espera</span>
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="store-fundamentals-summary">
          {phase === "confirmed" && (
            <div className="store-fundamentals-summary-card">
              <div className="store-fundamentals-summary-icon">
                <CheckCircle size={24} aria-hidden="true" />
              </div>
              <h2>Pedido confirmado!</h2>
              <p className="store-order-ref">Referência: <strong>{orderNumber}</strong></p>
              <p>Sua solicitação foi registrada. Nossa equipe de curadoria entrará em contato para finalizar os detalhes da entrega.</p>
              <button
                type="button"
                onClick={handleReset}
                className="store-fundamental-action-btn store-fundamental-action-reset"
                aria-label="Explorar nova curadoria"
              >
                <RefreshCw size={17} aria-hidden="true" />
                <span>Explorar nova curadoria</span>
              </button>
            </div>
          )}
          {phase === "idle" && (
            <p className="store-fundamentals-summary-placeholder">
              Nenhum pedido em andamento. Selecione um item para solicitar.
            </p>
          )}
        </div>

        <p className="demo-note" role="status" aria-live="polite">
          {phase === "idle" && "Demonstração interativa. Clique em &quot;Solicitar pedido&quot; para experimentar os estados."}
          {phase === "processing" && "Pedido em processamento. Aguarde a confirmação."}
          {phase === "confirmed" && "Pedido confirmado. Use &quot;Explorar nova curadoria&quot; para resetar."}
        </p>
      </div>
    </section>
  );
}
