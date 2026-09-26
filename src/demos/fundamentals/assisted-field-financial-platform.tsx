"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, TrendingUp, DollarSign, Tag, Calendar } from "lucide-react";

type FieldState = "idle" | "focused" | "valid" | "error" | "complete";

export default function AssistedFieldFinancialPlatform() {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    description: false,
    value: false,
    category: false,
    transactionDate: false,
  });

  const [fieldStates, setFieldStates] = useState<{ [key: string]: FieldState }>({
    description: "idle",
    value: "idle",
    category: "idle",
    transactionDate: "idle",
  });

  const validateDescription = (desc: string): FieldState => {
    if (!desc) return "idle";
    if (desc.length < 5) return "error";
    return "valid";
  };

  const validateValue = (val: string): FieldState => {
    if (!val) return "idle";
    const num = parseFloat(val.replace(/\./g, "").replace(",", "."));
    if (isNaN(num) || num <= 0) return "error";
    if (num > 1000000) return "error";
    return "valid";
  };

  const validateCategory = (cat: string): FieldState => {
    if (!cat) return "idle";
    return "valid";
  };

  const validateTransactionDate = (date: string): FieldState => {
    if (!date) return "idle";
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    if (selected < oneYearAgo || selected > today) return "error";
    return "valid";
  };

  const formatCurrency = (valueStr: string): string => {
    const cleaned = valueStr.replace(/[^\d,]/g, "");
    const num = parseInt(cleaned.replace(/\./g, ""), 10);
    if (isNaN(num)) return "";
    return num.toLocaleString("pt-BR");
  };

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    const state = validateDescription(val);
    setFieldStates((prev) => ({ ...prev, description: state }));
  };

  const handleValueChange = (val: string) => {
    const formatted = formatCurrency(val);
    setValue(formatted);
    const state = validateValue(formatted);
    setFieldStates((prev) => ({ ...prev, value: state }));
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    const state = validateCategory(val);
    setFieldStates((prev) => ({ ...prev, category: state }));
  };

  const handleTransactionDateChange = (val: string) => {
    setTransactionDate(val);
    const state = validateTransactionDate(val);
    setFieldStates((prev) => ({ ...prev, transactionDate: state }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getHelpText = (field: string, state: FieldState) => {
    if (state === "idle") {
      if (field === "description") return "Descreva a transação";
      if (field === "value") return "Valor em reais (R$)";
      if (field === "category") return "Categorize a transação";
      return "Data da transação (até 1 ano)";
    }
    if (state === "error") {
      if (field === "description") return "Mínimo 5 caracteres";
      if (field === "value") return "Informe um valor válido até R$ 1.000.000";
      if (field === "category") return "Selecione uma categoria";
      return "Data deve ser nos últimos 12 meses";
    }
    if (state === "valid") {
      if (field === "description") return "Descrição registrada ✓";
      if (field === "value") return "Valor validado ✓";
      if (field === "category") return "Categoria selecionada ✓";
      return "Data confirmada ✓";
    }
    return "";
  };

  const getIcon = (state: FieldState) => {
    if (state === "valid" || state === "complete") {
      return <CheckCircle2 size={18} aria-hidden="true" className="text-emerald-700" />;
    }
    if (state === "error") {
      return <AlertCircle size={18} aria-hidden="true" className="text-red-500" />;
    }
    return null;
  };

  const getStateClasses = (state: FieldState) => {
    if (state === "valid" || state === "complete")
      return "border-emerald-700 bg-emerald-50 focus-within:ring-emerald-700";
    if (state === "error")
      return "border-red-500 bg-red-50 focus-within:ring-red-500";
    return "border-slate-400 focus-within:border-blue-900 focus-within:ring-blue-900";
  };

  const validCategories = [
    "Receita",
    "Despesa fixa",
    "Despesa variável",
    "Investimento",
    "Poupança",
    "Dívida",
  ];

  const allFieldsComplete =
    fieldStates.description === "valid" &&
    fieldStates.value === "valid" &&
    fieldStates.category === "valid" &&
    fieldStates.transactionDate === "valid";

  return (
    <section className="demo-financial" aria-label="Campo assistido — Plataforma Financeira">
      <div className="financial-container">
        <div className="financial-header">
          <span className="demo-kicker">FUNDAMENTOS / 013</span>
          <div className="financial-badge-row">
            <TrendingUp size={14} aria-hidden="true" />
            <span>Plataforma Financeira — Registro de Transações</span>
          </div>
        </div>

        <div className="financial-hero">
          <div className="financial-hero-content">
            <DollarSign size={28} aria-hidden="true" className="financial-hero-icon" />
            <h1>
              Cada real conta. Cada{" "}
              <em>história</em> importa.
            </h1>
            <p>
              Registre transações com clareza. Campos validados para que cada movimento financeiro seja compreendido — da descrição ao valor.
            </p>
          </div>
        </div>

        <form className="financial-form" onSubmit={(e) => e.preventDefault()}>
          <div className="financial-field">
            <label htmlFor="fin-description" className="financial-label">
              <Tag size={16} aria-hidden="true" />
              Descrição da Transação
            </label>
            <div
              className={`financial-input-wrapper ${getStateClasses(fieldStates.description)}`}
              role="group"
              aria-label="Descrição"
            >
              <input
                id="fin-description"
                type="text"
                placeholder="Ex: Salário mensal, Aluguel, Dividendos"
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({ ...prev, description: "focused" }))
                }
                onBlur={() => handleBlur("description")}
                aria-invalid={fieldStates.description === "error"}
                aria-describedby="help-description"
                autoComplete="off"
              />
              {getIcon(fieldStates.description)}
            </div>
            <p
              id="help-description"
              className={`financial-help ${fieldStates.description === "error" && touched.description ? "error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("description", fieldStates.description)}
            </p>
          </div>

          <div className="financial-field">
            <label htmlFor="fin-value" className="financial-label">
              <DollarSign size={16} aria-hidden="true" />
              Valor (R$)
            </label>
            <div
              className={`financial-input-wrapper ${getStateClasses(fieldStates.value)}`}
              role="group"
              aria-label="Valor"
            >
              <input
                id="fin-value"
                type="text"
                inputMode="numeric"
                placeholder="Ex: 1500"
                value={value}
                onChange={(e) => handleValueChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({ ...prev, value: "focused" }))
                }
                onBlur={() => handleBlur("value")}
                aria-invalid={fieldStates.value === "error"}
                aria-describedby="help-value"
              />
              {getIcon(fieldStates.value)}
            </div>
            <p
              id="help-value"
              className={`financial-help ${fieldStates.value === "error" && touched.value ? "error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("value", fieldStates.value)}
            </p>
          </div>

          <div className="financial-field">
            <label htmlFor="fin-category" className="financial-label">
              <Tag size={16} aria-hidden="true" />
              Categoria
            </label>
            <div
              className={`financial-input-wrapper ${getStateClasses(fieldStates.category)}`}
              role="group"
              aria-label="Categoria"
            >
              <select
                id="fin-category"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({ ...prev, category: "focused" }))
                }
                onBlur={() => handleBlur("category")}
                aria-invalid={fieldStates.category === "error"}
                aria-describedby="help-category"
              >
                <option value="">Selecione a categoria</option>
                {validCategories.map((cat) => (
                  <option key={cat} value={cat.toLowerCase().replace(" ", "-")}>
                    {cat}
                  </option>
                ))}
              </select>
              {getIcon(fieldStates.category)}
            </div>
            <p
              id="help-category"
              className={`financial-help ${fieldStates.category === "error" && touched.category ? "error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("category", fieldStates.category)}
            </p>
          </div>

          <div className="financial-field">
            <label htmlFor="fin-date" className="financial-label">
              <Calendar size={16} aria-hidden="true" />
              Data da Transação
            </label>
            <div
              className={`financial-input-wrapper ${getStateClasses(fieldStates.transactionDate)}`}
              role="group"
              aria-label="Data da transação"
            >
              <input
                id="fin-date"
                type="date"
                value={transactionDate}
                onChange={(e) => handleTransactionDateChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({
                    ...prev,
                    transactionDate: "focused",
                  }))
                }
                onBlur={() => handleBlur("transactionDate")}
                aria-invalid={fieldStates.transactionDate === "error"}
                aria-describedby="help-date"
                max={new Date().toISOString().split("T")[0]}
              />
              {getIcon(fieldStates.transactionDate)}
            </div>
            <p
              id="help-date"
              className={`financial-help ${fieldStates.transactionDate === "error" && touched.transactionDate ? "error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("transactionDate", fieldStates.transactionDate)}
            </p>
          </div>

          <div className="financial-actions">
            <button
              type="submit"
              disabled={!allFieldsComplete}
              className={`financial-submit-btn ${allFieldsComplete ? "is-active" : ""}`}
              aria-label="Registrar transação"
            >
              <TrendingUp size={18} aria-hidden="true" />
              Registrar Transação
            </button>
            {allFieldsComplete && (
              <div className="financial-success" role="status" aria-live="polite">
                <CheckCircle2 size={16} aria-hidden="true" />
                <span>Transação validada com sucesso!</span>
              </div>
            )}
          </div>
        </form>

        <p className="financial-footer">
          Demonstração interativa. Nenhum dado é enviado para servidores.
        </p>
      </div>
    </section>
  );
}
