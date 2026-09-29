"use client";

import { useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Palette,
  Target,
  User,
} from "lucide-react";

type FieldState = "idle" | "focused" | "valid" | "error";

const trilhas = [
  { value: "ilustracao", label: "Ilustração", detail: "Aquarela, digital e editorial" },
  { value: "motion", label: "Motion Design", detail: "Animação 2D e 3D" },
  { value: "fotografia", label: "Fotografia", detail: "Ensaio, retrato e luz" },
  { value: "sonoro", label: "Design Sonoro", detail: "Áudio para imagem e jogos" },
  { value: "escrita", label: "Escrita Criativa", detail: "Roteiro e ficção" },
];

const frequencias = [
  { value: "1x", label: "1x por semana" },
  { value: "2x", label: "2x por semana" },
  { value: "3x", label: "3x por semana" },
];

export default function AssistedFieldCreativeSchool() {
  const [studentName, setStudentName] = useState("");
  const [track, setTrack] = useState("");
  const [frequency, setFrequency] = useState("2x");
  const [goal, setGoal] = useState(4);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    name: false,
    track: false,
  });
  const [fieldStates, setFieldStates] = useState<{ [key: string]: FieldState }>({
    name: "idle",
    track: "idle",
  });
  const [submitted, setSubmitted] = useState(false);

  const validateName = (value: string): FieldState => {
    if (!value) return "idle";
    if (value.trim().length < 3) return "error";
    return "valid";
  };

  const validateTrack = (value: string): FieldState => {
    if (!value) return "idle";
    return "valid";
  };

  const handleNameChange = (value: string) => {
    setStudentName(value);
    setFieldStates((prev) => ({ ...prev, name: validateName(value) }));
  };

  const handleTrackChange = (value: string) => {
    setTrack(value);
    setFieldStates((prev) => ({ ...prev, track: validateTrack(value) }));
  };

  const handleBlur = (field: "name" | "track") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getHelpText = (field: "name" | "track", state: FieldState) => {
    if (field === "name") {
      if (state === "idle") return "Nome do estudante matriculado";
      if (state === "error") return "Informe pelo menos 3 letras";
      if (state === "valid") return "Nome registrado ✓";
    }
    if (state === "idle") return "Escolha onde o estudante quer evoluir";
    if (state === "error") return "Escolha uma trilha para continuar";
    return "Trilha selecionada ✓";
  };

  const getIcon = (state: FieldState) => {
    if (state === "valid")
      return <CheckCircle2 size={18} aria-hidden="true" className="creative-icon-valid" />;
    if (state === "error")
      return <AlertCircle size={18} aria-hidden="true" className="creative-icon-error" />;
    return null;
  };

  const getStateClasses = (state: FieldState) => {
    if (state === "valid") return "is-valid";
    if (state === "error") return "is-error";
    return "";
  };

  const allFieldsComplete =
    fieldStates.name === "valid" && fieldStates.track === "valid";
  const trilhaLabel = trilhas.find((t) => t.value === track)?.label ?? "";
  const frequenciaLabel =
    frequencias.find((f) => f.value === frequency)?.label ?? "";
  const matriculaCode = `EC-2026-${String(
    (studentName.length * 7919 + goal * 131 + track.length * 17) % 9000 + 1000
  ).padStart(4, "0")}`;

  return (
    <section className="demo-creative" aria-label="Campo assistido — Escola Criativa">
      <div className="creative-container">
        <div className="creative-header">
          <span className="demo-kicker">FUNDAMENTOS / 016</span>
          <div className="creative-badge-row">
            <Palette size={14} aria-hidden="true" />
            <span>Escola Criativa — Matrícula de Aulas</span>
          </div>
        </div>

        <div className="creative-hero">
          <GraduationCap size={28} aria-hidden="true" className="creative-hero-icon" />
          <h1>
            Aprender é um <em>ato criativo</em>.
          </h1>
          <p>
            Matricule o estudante em uma trilha de aulas, defina a frequência e
            acompanhe a meta de progresso do semestre. Tudo é validado em tempo
            real, sem enviar dados para fora.
          </p>
        </div>

        <form
          className="creative-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (allFieldsComplete) setSubmitted(true);
          }}
        >
          <div className="creative-field">
            <label htmlFor="creative-name" className="creative-label">
              <User size={16} aria-hidden="true" /> Nome do estudante
            </label>
            <div
              className={`creative-input-wrapper ${getStateClasses(fieldStates.name)}`}
              role="group"
              aria-label="Nome do estudante"
            >
              <input
                id="creative-name"
                type="text"
                placeholder="Ex.: Marina Costa"
                value={studentName}
                onChange={(e) => handleNameChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({ ...prev, name: "focused" }))
                }
                onBlur={() => handleBlur("name")}
                aria-invalid={fieldStates.name === "error"}
                aria-describedby="help-name"
                autoComplete="name"
              />
              {getIcon(fieldStates.name)}
            </div>
            <p
              id="help-name"
              className={`creative-help ${
                fieldStates.name === "error" && touched.name
                  ? "is-error"
                  : fieldStates.name === "valid"
                    ? "is-valid"
                    : ""
              }`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("name", fieldStates.name)}
            </p>
          </div>

          <div className="creative-field">
            <label htmlFor="creative-track" className="creative-label">
              <BookOpen size={16} aria-hidden="true" /> Trilha de aulas
            </label>
            <div
              className={`creative-input-wrapper ${getStateClasses(fieldStates.track)}`}
              role="group"
              aria-label="Trilha de aulas"
            >
              <select
                id="creative-track"
                value={track}
                onChange={(e) => handleTrackChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({ ...prev, track: "focused" }))
                }
                onBlur={() => handleBlur("track")}
                aria-invalid={fieldStates.track === "error"}
                aria-describedby="help-track"
              >
                <option value="" disabled>
                  Selecione uma trilha
                </option>
                {trilhas.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label} — {t.detail}
                  </option>
                ))}
              </select>
              {getIcon(fieldStates.track)}
            </div>
            <p
              id="help-track"
              className={`creative-help ${
                fieldStates.track === "error" && touched.track
                  ? "is-error"
                  : fieldStates.track === "valid"
                    ? "is-valid"
                    : ""
              }`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("track", fieldStates.track)}
            </p>
          </div>

          <fieldset className="creative-fieldset">
            <legend className="creative-label">
              <Clock size={16} aria-hidden="true" /> Frequência de aulas
            </legend>
            <div className="creative-freq">
              {frequencias.map((f) => (
                <label key={f.value} className="creative-freq-option">
                  <input
                    type="radio"
                    name="creative-frequency"
                    value={f.value}
                    checked={frequency === f.value}
                    onChange={() => setFrequency(f.value)}
                  />
                  {f.label}
                </label>
              ))}
            </div>
            <p className="creative-help is-valid" role="status" aria-live="polite">
              Frequência definida ✓
            </p>
          </fieldset>

          <div className="creative-field">
            <label htmlFor="creative-goal" className="creative-label">
              <Target size={16} aria-hidden="true" /> Meta de progresso
            </label>
            <input
              id="creative-goal"
              type="range"
              min={1}
              max={10}
              step={1}
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="creative-slider"
              aria-describedby="help-goal"
              aria-valuetext={`${goal} módulos no semestre`}
            />
            <p
              id="help-goal"
              className="creative-help is-valid"
              role="status"
              aria-live="polite"
            >
              Meta de {goal} módulo{goal > 1 ? "s" : ""} no semestre ✓
            </p>
          </div>

          {allFieldsComplete && (
            <div className="creative-pass" role="status">
              <p>
                <strong>Matrícula pronta</strong>
                <br />
                {studentName.trim()} • {trilhaLabel} • {frequenciaLabel} •{" "}
                {goal} módulos
              </p>
            </div>
          )}

          {submitted && (
            <div className="creative-success" role="status">
              <CheckCircle2 size={22} aria-hidden="true" />
              <div>
                <strong>Matrícula registrada</strong>
                <p>
                  Referência {matriculaCode} • Nenhum dado foi enviado para
                  serviços externos.
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="creative-submit"
            disabled={!allFieldsComplete || submitted}
          >
            {submitted ? "Matrícula confirmada" : "Confirmar matrícula"}
          </button>
        </form>
      </div>
    </section>
  );
}
