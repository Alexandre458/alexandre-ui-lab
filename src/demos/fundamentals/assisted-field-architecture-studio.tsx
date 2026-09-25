"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Building2, Ruler, Palette, Calendar } from "lucide-react";

type FieldState = "idle" | "focused" | "valid" | "error" | "complete";

export default function AssistedFieldArchitectureStudio() {
  const [projectName, setProjectName] = useState("");
  const [area, setArea] = useState("");
  const [projectType, setProjectType] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);
  const [visitDate, setVisitDate] = useState("");
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    projectName: false,
    area: false,
    projectType: false,
    visitDate: false,
  });

  const [fieldStates, setFieldStates] = useState<{ [key: string]: FieldState }>({
    projectName: "idle",
    area: "idle",
    projectType: "idle",
    visitDate: "idle",
  });

  const validateProjectName = (name: string): FieldState => {
    if (!name) return "idle";
    if (name.length < 4) return "error";
    return "valid";
  };

  const validateArea = (value: string): FieldState => {
    if (!value) return "idle";
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return "error";
    if (num > 50000) return "error";
    return "valid";
  };

  const validateProjectType = (type: string): FieldState => {
    if (!type) return "idle";
    return "valid";
  };

  const validateVisitDate = (date: string): FieldState => {
    if (!date) return "idle";
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) return "error";
    return "valid";
  };

  const toggleMaterial = (material: string) => {
    const updated = materials.includes(material)
      ? materials.filter((m) => m !== material)
      : [...materials, material];
    setMaterials(updated);
  };

  const validMaterials = ["Concreto aparente", "Madeira natural", "Vidro temperado", "Aço corten", "Cerâmica artesanal"];

  const handleProjectNameChange = (value: string) => {
    setProjectName(value);
    const state = validateProjectName(value);
    setFieldStates((prev) => ({ ...prev, projectName: state }));
  };

  const handleAreaChange = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, "");
    setArea(cleaned);
    const state = validateArea(cleaned);
    setFieldStates((prev) => ({ ...prev, area: state }));
  };

  const handleProjectTypeChange = (value: string) => {
    setProjectType(value);
    const state = validateProjectType(value);
    setFieldStates((prev) => ({ ...prev, projectType: state }));
  };

  const handleVisitDateChange = (value: string) => {
    setVisitDate(value);
    const state = validateVisitDate(value);
    setFieldStates((prev) => ({ ...prev, visitDate: state }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getHelpText = (field: string, state: FieldState) => {
    if (state === "idle") {
      if (field === "projectName") return "Nome criativo para seu projeto";
      if (field === "area") return "Área total em metros quadrados (m²)";
      if (field === "projectType") return "Tipo de espaço a ser projetado";
      return "Data para visita técnica ao terreno";
    }
    if (state === "error") {
      if (field === "projectName") return "Mínimo 4 caracteres";
      if (field === "area") return "Informe uma área válida entre 1 e 50.000 m²";
      if (field === "projectType") return "Selecione um tipo de projeto";
      return "Data deve ser futura ou hoje";
    }
    if (state === "valid") {
      if (field === "projectName") return "Nome registrado ✓";
      if (field === "area") return "Área validada ✓";
      if (field === "projectType") return "Tipo selecionado ✓";
      return "Data confirmada ✓";
    }
    return "";
  };

  const getIcon = (state: FieldState) => {
    if (state === "valid" || state === "complete") {
      return <CheckCircle2 size={18} aria-hidden="true" className="text-amber-700" />;
    }
    if (state === "error") {
      return <AlertCircle size={18} aria-hidden="true" className="text-red-500" />;
    }
    return null;
  };

  const getStateClasses = (state: FieldState) => {
    if (state === "valid" || state === "complete")
      return "border-amber-700 bg-amber-50 focus-within:ring-amber-700";
    if (state === "error")
      return "border-red-500 bg-red-50 focus-within:ring-red-500";
    return "border-stone-300 focus-within:border-stone-700 focus-within:ring-stone-700";
  };

  const allFieldsComplete =
    fieldStates.projectName === "valid" &&
    fieldStates.area === "valid" &&
    fieldStates.projectType === "valid" &&
    fieldStates.visitDate === "valid" &&
    materials.length >= 2;

  return (
    <section className="demo-architecture" aria-label="Campo assistido — Estúdio de Arquitetura">
      <div className="architecture-container">
        <div className="architecture-header">
          <span className="demo-kicker">FUNDAMENTOS / 012</span>
          <div className="architecture-badge-row">
            <Building2 size={14} aria-hidden="true" />
            <span>Estúdio de Arquitetura — Solicitações de Projetos</span>
          </div>
        </div>

        <div className="architecture-hero">
          <div className="architecture-hero-content">
            <Ruler size={28} aria-hidden="true" className="architecture-hero-icon" />
            <h1>
              Cada espaço tem uma{" "}
              <em>história</em> para construir.
            </h1>
            <p>
              Descreva seu projeto espacial. Campos validados para que cada detalhe seja compreendido — do conceito ao material.
            </p>
          </div>
        </div>

        <form className="architecture-form" onSubmit={(e) => e.preventDefault()}>
          <div className="architecture-field">
            <label htmlFor="arch-project-name" className="architecture-label">
              <Building2 size={16} aria-hidden="true" />
              Nome do Projeto
            </label>
            <div
              className={`architecture-input-wrapper ${getStateClasses(fieldStates.projectName)}`}
              role="group"
              aria-label="Nome do projeto"
            >
              <input
                id="arch-project-name"
                type="text"
                placeholder="Ex: Residência Vale Verde"
                value={projectName}
                onChange={(e) => handleProjectNameChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({ ...prev, projectName: "focused" }))
                }
                onBlur={() => handleBlur("projectName")}
                aria-invalid={fieldStates.projectName === "error"}
                aria-describedby="help-project-name"
                autoComplete="off"
              />
              {getIcon(fieldStates.projectName)}
            </div>
            <p
              id="help-project-name"
              className={`architecture-help ${fieldStates.projectName === "error" && touched.projectName ? "error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("projectName", fieldStates.projectName)}
            </p>
          </div>

          <div className="architecture-field">
            <label htmlFor="arch-area" className="architecture-label">
              <Ruler size={16} aria-hidden="true" />
              Área do Projeto (m²)
            </label>
            <div
              className={`architecture-input-wrapper ${getStateClasses(fieldStates.area)}`}
              role="group"
              aria-label="Área do projeto"
            >
              <input
                id="arch-area"
                type="text"
                inputMode="numeric"
                placeholder="Ex: 250"
                value={area}
                onChange={(e) => handleAreaChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({ ...prev, area: "focused" }))
                }
                onBlur={() => handleBlur("area")}
                aria-invalid={fieldStates.area === "error"}
                aria-describedby="help-area"
              />
              {getIcon(fieldStates.area)}
            </div>
            <p
              id="help-area"
              className={`architecture-help ${fieldStates.area === "error" && touched.area ? "error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("area", fieldStates.area)}
            </p>
          </div>

          <div className="architecture-field">
            <label htmlFor="arch-type" className="architecture-label">
              <Palette size={16} aria-hidden="true" />
              Tipo de Projeto
            </label>
            <div
              className={`architecture-input-wrapper ${getStateClasses(fieldStates.projectType)}`}
              role="group"
              aria-label="Tipo de projeto"
            >
              <select
                id="arch-type"
                value={projectType}
                onChange={(e) => handleProjectTypeChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({ ...prev, projectType: "focused" }))
                }
                onBlur={() => handleBlur("projectType")}
                aria-invalid={fieldStates.projectType === "error"}
                aria-describedby="help-type"
              >
                <option value="">Selecione o tipo de espaço</option>
                <option value="residential">Residencial</option>
                <option value="commercial">Comercial</option>
                <option value="cultural">Cultural</option>
                <option value="educational">Educacional</option>
                <option value="mixed">Uso Misto</option>
              </select>
              {getIcon(fieldStates.projectType)}
            </div>
            <p
              id="help-type"
              className={`architecture-help ${fieldStates.projectType === "error" && touched.projectType ? "error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("projectType", fieldStates.projectType)}
            </p>
          </div>

          <div className="architecture-field">
            <label className="architecture-label">
              <Palette size={16} aria-hidden="true" />
              Materiais Preferidos
            </label>
            <div className="architecture-materials" role="group" aria-label="Materiais preferidos">
              <small className="architecture-materials-hint">Selecione pelo menos 2 opções</small>
              <div className="architecture-material-options">
                {validMaterials.map((material) => (
                  <button
                    key={material}
                    type="button"
                    onClick={() => toggleMaterial(material)}
                    className={`architecture-material-chip ${materials.includes(material) ? "is-selected" : ""}`}
                    aria-pressed={materials.includes(material)}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="architecture-field">
            <label htmlFor="arch-visit-date" className="architecture-label">
              <Calendar size={16} aria-hidden="true" />
              Data da Visita Técnica
            </label>
            <div
              className={`architecture-input-wrapper ${getStateClasses(fieldStates.visitDate)}`}
              role="group"
              aria-label="Data da visita"
            >
              <input
                id="arch-visit-date"
                type="date"
                value={visitDate}
                onChange={(e) => handleVisitDateChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({
                    ...prev,
                    visitDate: "focused",
                  }))
                }
                onBlur={() => handleBlur("visitDate")}
                aria-invalid={fieldStates.visitDate === "error"}
                aria-describedby="help-visit-date"
                min={new Date().toISOString().split("T")[0]}
              />
              {getIcon(fieldStates.visitDate)}
            </div>
            <p
              id="help-visit-date"
              className={`architecture-help ${fieldStates.visitDate === "error" && touched.visitDate ? "error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("visitDate", fieldStates.visitDate)}
            </p>
          </div>

          <div className="architecture-actions">
            <button
              type="submit"
              disabled={!allFieldsComplete}
              className={`architecture-submit-btn ${allFieldsComplete ? "is-active" : ""}`}
              aria-label="Solicitar projeto"
            >
              <CheckCircle2 size={18} aria-hidden="true" />
              Solicitar Projeto
            </button>
            {allFieldsComplete && (
              <div className="architecture-success" role="status" aria-live="polite">
                <CheckCircle2 size={16} aria-hidden="true" />
                <span>Todas as informações validadas com sucesso!</span>
              </div>
            )}
          </div>
        </form>

        <p className="architecture-footer">
          Demonstração interativa. Nenhum dado é enviado para servidores.
        </p>
      </div>
    </section>
  );
}
