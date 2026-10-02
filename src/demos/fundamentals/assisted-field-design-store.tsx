"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
} from "lucide-react";

type FieldState = "idle" | "focused" | "valid" | "error";

const colecoes = [
  { value: "ceramica", label: "Cerâmica Objetos", detail: "Peças utilitárias", price: 189 },
  { value: "poster", label: "Pôsteres Gráficos", detail: "Edição limitada", price: 96 },
  { value: "tecil", label: "Têxtil", detail: "Fibras naturais", price: 240 },
  { value: "moveis", label: "Mobiliário", detail: "Madeira maciça", price: 1290 },
  { value: "fotografia", label: "Fotografia", detail: "Impressão giclée", price: 150 },
];

const formatos = [
  { value: "padrao", label: "Padrão", detail: "5–7 dias úteis", extra: 0 },
  { value: "expresso", label: "Expresso", detail: "2–3 dias úteis", extra: 39 },
];

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AssistedFieldDesignStore() {
  const [collection, setCollection] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [format, setFormat] = useState("padrao");
  const [touched, setTouched] = useState(false);
  const [fieldStates, setFieldStates] = useState<{ collection: FieldState }>({
    collection: "idle",
  });
  const [submitted, setSubmitted] = useState(false);

  const validateCollection = (value: string): FieldState => {
    if (!value) return "idle";
    return "valid";
  };

  const handleCollectionChange = (value: string) => {
    setCollection(value);
    setFieldStates({ collection: validateCollection(value) });
  };

  const handleCollectionBlur = () => {
    setTouched(true);
    if (!collection) setFieldStates({ collection: "error" });
  };

  const getHelpText = (state: FieldState) => {
    if (state === "idle") return "Escolha uma coleção para continuar";
    if (state === "error") return "Escolha uma coleção para continuar";
    return "Coleção selecionada ✓";
  };

  const getIcon = (state: FieldState) => {
    if (state === "valid")
      return <CheckCircle2 size={18} aria-hidden="true" className="design-icon-valid" />;
    if (state === "error")
      return <AlertCircle size={18} aria-hidden="true" className="design-icon-error" />;
    return null;
  };

  const getStateClasses = (state: FieldState) => {
    if (state === "valid") return "is-valid";
    if (state === "error") return "is-error";
    return "";
  };

  const allFieldsComplete = fieldStates.collection === "valid";
  const colecao = colecoes.find((c) => c.value === collection);
  const formato = formatos.find((f) => f.value === format)!;
  const total = colecao ? colecao.price * quantity + formato.extra : 0;
  const orderCode = `DS-2026-${String(
    (collection.length * 7919 + quantity * 131 + format.length * 17) % 9000 + 1000
  ).padStart(4, "0")}`;

  return (
    <section className="demo-design" aria-label="Campo assistido — Loja de Design">
      <div className="design-container">
        <div className="design-header">
          <span className="demo-kicker">FUNDAMENTOS / 017</span>
          <div className="design-badge-row">
            <ShoppingBag size={14} aria-hidden="true" />
            <span>Loja de Design — Pedido de Coleção</span>
          </div>
        </div>

        <div className="design-hero">
          <h1>
            Uma peça, <em>uma história</em>.
          </h1>
          <p>
            Monte seu pedido de coleção, ajuste a quantidade e escolha o formato
            de entrega. O total é calculado em tempo real, sem processar nenhum
            pagamento.
          </p>
        </div>

        <form
          className="design-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (allFieldsComplete) setSubmitted(true);
          }}
        >
          <div className="design-field">
            <label htmlFor="design-collection" className="design-label">
              <ShoppingBag size={16} aria-hidden="true" /> Coleção
            </label>
            <div
              className={`design-input-wrapper ${getStateClasses(fieldStates.collection)}`}
              role="group"
              aria-label="Coleção"
            >
              <select
                id="design-collection"
                value={collection}
                onChange={(e) => handleCollectionChange(e.target.value)}
                onFocus={() => setFieldStates({ collection: "focused" })}
                onBlur={handleCollectionBlur}
                aria-invalid={fieldStates.collection === "error"}
                aria-describedby="help-collection"
              >
                <option value="" disabled>
                  Selecione uma coleção
                </option>
                {colecoes.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label} — {c.detail}
                  </option>
                ))}
              </select>
              {getIcon(fieldStates.collection)}
            </div>
            <p
              id="help-collection"
              className={`design-help ${
                fieldStates.collection === "error" && touched
                  ? "is-error"
                  : fieldStates.collection === "valid"
                    ? "is-valid"
                    : ""
              }`}
              role="status"
              aria-live="polite"
            >
              {getHelpText(fieldStates.collection)}
            </p>
          </div>

          <div className="design-field">
            <span className="design-label" id="design-qty-label">
              <Plus size={16} aria-hidden="true" /> Quantidade
            </span>
            <div
              className="design-stepper"
              role="group"
              aria-labelledby="design-qty-label"
            >
              <button
                type="button"
                aria-label="Diminuir quantidade"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={16} aria-hidden="true" />
              </button>
              <span className="design-stepper-value" role="status" aria-live="polite">
                {quantity} {quantity === 1 ? "item" : "itens"}
              </span>
              <button
                type="button"
                aria-label="Aumentar quantidade"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                disabled={quantity >= 10}
              >
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>
            <p className="design-help" role="status" aria-live="polite">
              De 1 a 10 itens por pedido
            </p>
          </div>

          <fieldset className="design-fieldset">
            <legend className="design-label">
              <Truck size={16} aria-hidden="true" /> Formato de entrega
            </legend>
            <div className="design-formatos">
              {formatos.map((f) => (
                <label key={f.value} className="design-formato">
                  <input
                    type="radio"
                    name="design-format"
                    value={f.value}
                    checked={format === f.value}
                    onChange={() => setFormat(f.value)}
                  />
                  <strong>{f.label}</strong>
                  <span>
                    {f.detail}
                    {f.extra > 0 ? ` • +${formatBRL(f.extra)}` : ""}
                  </span>
                </label>
              ))}
            </div>
            <p className="design-help is-valid" role="status" aria-live="polite">
              Formato definido ✓
            </p>
          </fieldset>

          {allFieldsComplete && (
            <div className="design-summary" role="status" aria-live="polite">
              <p className="design-summary-line">
                <span>
                  {colecao?.label} • {quantity} {quantity === 1 ? "item" : "itens"}
                </span>
                <strong>{formatBRL(total)}</strong>
              </p>
              <p className="design-summary-note">
                Entrega {formato.label.toLowerCase()} • {formato.detail}
              </p>
            </div>
          )}

          {submitted && (
            <div className="design-success" role="status">
              <CheckCircle2 size={22} aria-hidden="true" />
              <div>
                <strong>Pedido registrado</strong>
                <p>
                  Referência {orderCode} • Nenhum pagamento foi processado.
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="design-submit"
            disabled={!allFieldsComplete || submitted}
          >
            {submitted ? "Pedido confirmado" : "Confirmar pedido"}
          </button>
        </form>
      </div>
    </section>
  );
}
