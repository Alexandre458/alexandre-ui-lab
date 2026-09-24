"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, User, Calendar, Stethoscope } from "lucide-react";

type FieldState = "idle" | "focused" | "valid" | "error" | "complete";

export default function AssistedFieldPreventiveClinic() {
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    fullName: false,
    cpf: false,
    appointmentDate: false,
  });

  const [fieldStates, setFieldStates] = useState<{ [key: string]: FieldState }>({
    fullName: "idle",
    cpf: "idle",
    appointmentDate: "idle",
  });

  const validateFullName = (name: string): FieldState => {
    if (!name) return "idle";
    if (name.length < 3) return "error";
    if (name.split(" ").length < 2) return "error";
    return "valid";
  };

  const validateCpf = (cpfValue: string): FieldState => {
    if (!cpfValue) return "idle";
    const cleaned = cpfValue.replace(/\D/g, "");
    if (cleaned.length !== 11) return "error";
    if (/^(\d)\1{10}$/.test(cleaned)) return "error";
    return "valid";
  };

  const validateAppointmentDate = (date: string): FieldState => {
    if (!date) return "idle";
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) return "error";
    return "valid";
  };

  const formatCpf = (value: string): string => {
    const cleaned = value.replace(/\D/g, "").slice(0, 11);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9)
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  };

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    const state = validateFullName(value);
    setFieldStates((prev) => ({ ...prev, fullName: state }));
  };

  const handleCpfChange = (value: string) => {
    const formatted = formatCpf(value);
    setCpf(formatted);
    const cleaned = formatted.replace(/\D/g, "");
    const state = validateCpf(cleaned);
    setFieldStates((prev) => ({ ...prev, cpf: state }));
  };

  const handleAppointmentChange = (value: string) => {
    setAppointmentDate(value);
    const state = validateAppointmentDate(value);
    setFieldStates((prev) => ({ ...prev, appointmentDate: state }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getHelpText = (field: string, state: FieldState) => {
    if (state === "idle") {
      if (field === "fullName") return "Nome completo para cadastro";
      if (field === "cpf") return "Apenas números, 11 dígitos";
      return "Data para consulta preventiva";
    }
    if (state === "error") {
      if (field === "fullName") return "Informe nome e sobrenome";
      if (field === "cpf") return "CPF inválido. Verifique os números";
      return "Data deve ser futura ou hoje";
    }
    if (state === "valid") {
      if (field === "fullName") return "Cadastro completo ✓";
      if (field === "cpf") return "CPF validado ✓";
      return "Data confirmada ✓";
    }
    return "";
  };

  const getIcon = (state: FieldState) => {
    if (state === "valid" || state === "complete") {
      return <CheckCircle2 size={18} aria-hidden="true" className="text-emerald-600" />;
    }
    if (state === "error") {
      return <AlertCircle size={18} aria-hidden="true" className="text-red-500" />;
    }
    return null;
  };

  const getStateClasses = (state: FieldState) => {
    if (state === "valid" || state === "complete")
      return "border-emerald-600 bg-emerald-50 focus-within:ring-emerald-600";
    if (state === "error")
      return "border-red-500 bg-red-50 focus-within:ring-red-500";
    return "border-slate-300 focus-within:border-teal-600 focus-within:ring-teal-600";
  };

  const allFieldsComplete =
    fieldStates.fullName === "valid" &&
    fieldStates.cpf === "valid" &&
    fieldStates.appointmentDate === "valid";

  return (
    <section className="demo-preventive" aria-label="Campo assistido — Clínica Preventiva">
      <div className="preventive-container">
        <div className="preventive-header">
          <span className="demo-kicker">FUNDAMENTOS / 011</span>
          <div className="preventive-badge-row">
            <Stethoscope size={14} aria-hidden="true" />
            <span>Clínica Preventiva — Cadastro de Pacientes</span>
          </div>
        </div>

        <div className="preventive-hero">
          <div className="preventive-hero-content">
            <Calendar size={28} aria-hidden="true" className="preventive-hero-icon" />
            <h1>
              Cuidar começa com um <em>passo</em>.
            </h1>
            <p>
              Preencha seus dados para agendar sua consulta preventiva. Campos validados em tempo real para facilitar seu cadastro.
            </p>
          </div>
        </div>

        <form className="preventive-form" onSubmit={(e) => e.preventDefault()}>
          <div className="preventive-field">
            <label htmlFor="preventive-fullname" className="preventive-label">
              <User size={16} aria-hidden="true" />
              Nome Completo
            </label>
            <div
              className={`preventive-input-wrapper ${getStateClasses(fieldStates.fullName)}`}
              role="group"
              aria-label="Nome completo"
            >
              <input
                id="preventive-fullname"
                type="text"
                placeholder="Seu nome e sobrenome"
                value={fullName}
                onChange={(e) => handleFullNameChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({ ...prev, fullName: "focused" }))
                }
                onBlur={() => handleBlur("fullName")}
                aria-invalid={fieldStates.fullName === "error"}
                aria-describedby="help-fullname"
                autoComplete="name"
              />
              {getIcon(fieldStates.fullName)}
            </div>
            <p
              id="help-fullname"
              className={`preventive-help ${fieldStates.fullName === "error" && touched.fullName ? "error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("fullName", fieldStates.fullName)}
            </p>
          </div>

          <div className="preventive-field">
            <label htmlFor="preventive-cpf" className="preventive-label">
              <User size={16} aria-hidden="true" />
              CPF
            </label>
            <div
              className={`preventive-input-wrapper ${getStateClasses(fieldStates.cpf)}`}
              role="group"
              aria-label="CPF"
            >
              <input
                id="preventive-cpf"
                type="text"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => handleCpfChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({ ...prev, cpf: "focused" }))
                }
                onBlur={() => handleBlur("cpf")}
                aria-invalid={fieldStates.cpf === "error"}
                aria-describedby="help-cpf"
                maxLength={14}
                autoComplete="cc-csc"
              />
              {getIcon(fieldStates.cpf)}
            </div>
            <p
              id="help-cpf"
              className={`preventive-help ${fieldStates.cpf === "error" && touched.cpf ? "error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("cpf", fieldStates.cpf)}
            </p>
          </div>

          <div className="preventive-field">
            <label htmlFor="preventive-date" className="preventive-label">
              <Calendar size={16} aria-hidden="true" />
              Data da Consulta
            </label>
            <div
              className={`preventive-input-wrapper ${getStateClasses(
                fieldStates.appointmentDate
              )}`}
              role="group"
              aria-label="Data da consulta"
            >
              <input
                id="preventive-date"
                type="date"
                value={appointmentDate}
                onChange={(e) => handleAppointmentChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({
                    ...prev,
                    appointmentDate: "focused",
                  }))
                }
                onBlur={() => handleBlur("appointmentDate")}
                aria-invalid={fieldStates.appointmentDate === "error"}
                aria-describedby="help-date"
                min={new Date().toISOString().split("T")[0]}
              />
              {getIcon(fieldStates.appointmentDate)}
            </div>
            <p
              id="help-date"
              className={`preventive-help ${fieldStates.appointmentDate === "error" && touched.appointmentDate ? "error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText(
                "appointmentDate",
                fieldStates.appointmentDate
              )}
            </p>
          </div>

          <div className="preventive-actions">
            <button
              type="submit"
              disabled={!allFieldsComplete}
              className={`preventive-submit-btn ${allFieldsComplete ? "is-active" : ""}`}
              aria-label="Confirmar agendamento"
            >
              <CheckCircle2 size={18} aria-hidden="true" />
              Confirmar Agendamento
            </button>
            {allFieldsComplete && (
              <div className="preventive-success" role="status" aria-live="polite">
                <CheckCircle2 size={16} aria-hidden="true" />
                <span>Todos os campos validados com sucesso!</span>
              </div>
            )}
          </div>
        </form>

        <p className="preventive-footer">
          Demonstração interativa. Nenhum dado é enviado para servidores.
        </p>
      </div>
    </section>
  );
}
