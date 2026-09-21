"use client";

import { useState, useEffect, useRef } from "react";
import { Leaf, CheckCircle, Clock, BarChart3, Droplets, Wind, Flame } from "lucide-react";

type IndicatorPhase = "idle" | "processing" | "updated";
type Indicator = {
  id: number;
  name: string;
  metric: string;
  value: string;
  trend: "up" | "down" | "stable";
  icon: typeof Leaf;
  color: string;
};

const indicators: Indicator[] = [
  { id: 1, name: "Emissão de CO₂", metric: "toneladas/mês", value: "-12,4%", trend: "down", icon: Wind, color: "#059669" },
  { id: 2, name: "Consumo de Energia", metric: "kWh/mês", value: "-8,7%", trend: "down", icon: Flame, color: "#7c3aed" },
  { id: 3, name: "Taxa de Reciclagem", metric: "% de resíduos", value: "+15,3%", trend: "up", icon: Droplets, color: "#2563eb" },
];

export default function ContextualActionEnvironmental() {
  const [phase, setPhase] = useState<IndicatorPhase>("idle");
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [progress, setProgress] = useState(0);
  const [lastUpdate, setLastUpdate] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  function handleAnalyze(indicator: Indicator) {
    if (phase === "processing") return;
    setSelectedIndicator(indicator);
    setPhase("processing");
    setProgress(0);
    setLastUpdate("");

    timerRef.current = setTimeout(() => {
      setPhase("updated");
      setLastUpdate(new Date().toLocaleString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
      if (progressRef.current) clearInterval(progressRef.current);
    }, 3000);

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (progressRef.current) clearInterval(progressRef.current);
          return 100;
        }
        return prev + 3.33;
      });
    }, 100);
  }

  function handleReset() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setPhase("idle");
    setSelectedIndicator(null);
    setProgress(0);
    setLastUpdate("");
  }

  return (
    <section className="demo-environmental" aria-label="Ação contextual — Plataforma Ambiental">
      <div className="environmental-stage">
        <div className="environmental-header">
          <span className="demo-kicker">FUNDAMENTOS / 008</span>
          <div className="environmental-badge-row">
            <Leaf size={14} aria-hidden="true" />
            <span>Plataforma Ambiental — Indicadores de Sustentabilidade</span>
          </div>
        </div>

        <div className="environmental-hero">
          <div className="environmental-hero-content">
            <BarChart3 size={28} aria-hidden="true" className="env-hero-icon" />
            <h1>
              Números que <em>transformam</em>.
            </h1>
            <p>
              Equipes de sustentabilidade acompanham indicadores em tempo real. Analise um indicador e veja o status atualizado.
            </p>
          </div>
        </div>

        <div className="environmental-indicators">
          <h2>Indicadores da equipe</h2>
          <div className="environmental-indicator-list">
            {indicators.map((indicator) => {
              const IconComponent = indicator.icon;
              return (
                <article
                  key={indicator.id}
                  className={`environmental-indicator-card ${
                    selectedIndicator?.id === indicator.id ? "is-selected" : ""
                  } ${phase === "updated" && selectedIndicator?.id === indicator.id ? "is-updated" : ""}`}
                >
                  <div className="environmental-indicator-info">
                    <div className="environmental-indicator-meta">
                      <span
                        className="environmental-badge"
                        style={{ backgroundColor: indicator.color }}
                      >
                        {indicator.trend === "up"
                          ? "Positivo"
                          : indicator.trend === "down"
                          ? "Redução"
                          : "Estável"}
                      </span>
                      <span className="environmental-metric">{indicator.metric}</span>
                    </div>
                    <div className="environmental-indicator-name-row">
                      <IconComponent size={20} aria-hidden="true" className="indicator-icon" style={{ color: indicator.color }} />
                      <h3>{indicator.name}</h3>
                    </div>
                    <p className="environmental-indicator-value" style={{ color: indicator.color }}>
                      {indicator.value}
                    </p>
                  </div>
                  <div className="environmental-indicator-actions">
                    {phase === "idle" && (
                      <button
                        type="button"
                        onClick={() => handleAnalyze(indicator)}
                        className="env-action-btn env-action-primary"
                        aria-label={`Analisar indicador ${indicator.name}`}
                      >
                        <BarChart3 size={17} aria-hidden="true" />
                        <span>Analisar indicador</span>
                      </button>
                    )}
                    {phase === "processing" && selectedIndicator?.id === indicator.id && (
                      <div
                        className="env-action-progress"
                        role="progressbar"
                        aria-valuenow={Math.round(progress)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Processando indicador ${indicator.name}`}
                      >
                        <Clock size={17} aria-hidden="true" className="env-progress-spin" />
                        <span>Processando — {Math.round(progress)}%</span>
                        <div className="env-progress-track">
                          <div
                            className="env-progress-fill"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {phase === "updated" && selectedIndicator?.id === indicator.id && (
                      <div className="env-action-success">
                        <CheckCircle size={17} aria-hidden="true" />
                        <span>Indicador atualizado</span>
                        <span className="env-update-time">às {lastUpdate}</span>
                      </div>
                    )}
                    {phase !== "idle" && selectedIndicator?.id !== indicator.id && phase !== "processing" && (
                      <button
                        type="button"
                        disabled
                        className="env-action-btn env-action-muted"
                        aria-label={`Indicador ${indicator.name} já analisado`}
                      >
                        <CheckCircle size={17} aria-hidden="true" />
                        <span>Analisado</span>
                      </button>
                    )}
                    {phase === "processing" && selectedIndicator?.id !== indicator.id && (
                      <button
                        type="button"
                        disabled
                        className="env-action-btn env-action-muted"
                        aria-label={`Indicador ${indicator.name} em espera`}
                      >
                        <Clock size={17} aria-hidden="true" />
                        <span>Em espera</span>
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="environmental-summary">
          {phase === "updated" && (
            <div className="environmental-summary-card">
              <div className="environmental-summary-icon">
                <Leaf size={24} aria-hidden="true" />
              </div>
              <h2>Análise concluída!</h2>
              <p>
                O indicador de {'"'}{selectedIndicator?.name}{'"'} foi atualizado com sucesso.
                {selectedIndicator && selectedIndicator.trend === "down" && " A redução indica progresso consistente na equipe de sustentabilidade."}
                {selectedIndicator && selectedIndicator.trend === "up" && " O avanço demonstra o compromisso da organização com metas ambientais."}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="env-action-btn env-action-reset"
                aria-label="Analisar novo indicador"
              >
                <Clock size={17} aria-hidden="true" />
                <span>Analisar novo indicador</span>
              </button>
            </div>
          )}
          {phase === "idle" && (
            <p className="environmental-summary-placeholder">
              Nenhum indicador em análise. Selecione um indicador para começar.
            </p>
          )}
        </div>

        <p className="demo-note" role="status" aria-live="polite">
          {phase === "idle" && <span>Demonstração interativa. Clique em &quot;Analisar indicador&quot; para experimentar os estados.</span>}
          {phase === "processing" && "Indicador em processamento. Aguarde a atualização."}
          {phase === "updated" && <span>Indicador atualizado. Use &quot;Analisar novo indicador&quot; para resetar.</span>}
        </p>
      </div>
    </section>
  );
}
