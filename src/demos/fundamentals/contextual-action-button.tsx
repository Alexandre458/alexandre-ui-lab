"use client";

import { useState, useEffect, useRef } from "react";
import { Play, CheckCircle, Clock, RotateCw, Star, BookOpen, Trophy } from "lucide-react";

type StepPhase = "idle" | "playing" | "complete";
type Lesson = { id: number; title: string; duration: string; badge: string; badgeColor: string };

const lessons: Lesson[] = [
  { id: 1, title: "Introdução à Pintura Digital", duration: "15 min", badge: "Novo", badgeColor: "#7c3aed" },
  { id: 2, title: "Misturas de Cores e Texturas", duration: "22 min", badge: "Popular", badgeColor: "#f59e0b" },
  { id: 3, title: "Perspectiva em Artes Plásticas", duration: "18 min", badge: "Avançado", badgeColor: "#ef4444" },
];

export default function ContextualActionButton() {
  const [phase, setPhase] = useState<StepPhase>("idle");
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  function handleStart(lesson: Lesson) {
    if (phase === "playing") return;
    setCurrentLesson(lesson);
    setPhase("playing");
    setProgress(0);

    timerRef.current = setTimeout(() => {
      setPhase("complete");
      if (progressRef.current) clearInterval(progressRef.current);
    }, 4000);

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (progressRef.current) clearInterval(progressRef.current);
          return 100;
        }
        return prev + 2.5;
      });
    }, 100);
  }

  function handleReset() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setPhase("idle");
    setCurrentLesson(null);
    setProgress(0);
  }

  return (
    <section className="demo-fundamentals" aria-label="Botão de ação contextual — Escola Criativa">
      <div className="fundamentals-stage">
        <div className="fundamentals-header">
          <span className="demo-kicker">FUNDAMENTOS / 006</span>
          <div className="fundamentals-badge-row">
            <Star size={14} aria-hidden="true" />
            <span>A Escola Criativa — Trilha de Artes</span>
          </div>
        </div>

        <div className="fundamentals-hero">
          <div className="fundamentals-hero-content">
            <BookOpen size={28} aria-hidden="true" className="hero-icon" />
            <h1>
              Aprenda no seu <em>ritmo</em>.
            </h1>
            <p>
              Cada aula começa com uma intenção. Escolha uma trilha, inicie a experiência e acompanhe seu progresso.
            </p>
          </div>
        </div>

        <div className="fundamentals-lessons">
          <h2>Suas trilhas disponíveis</h2>
          <div className="fundamentals-lesson-list">
            {lessons.map((lesson) => (
              <article key={lesson.id} className={`fundamentals-lesson-card ${currentLesson?.id === lesson.id ? "is-selected" : ""} ${phase === "complete" && currentLesson?.id === lesson.id ? "is-complete" : ""}`}>
                <div className="fundamentals-lesson-info">
                  <div className="fundamentals-lesson-meta">
                    <span className="fundamentals-badge" style={{ backgroundColor: lesson.badgeColor }}>{lesson.badge}</span>
                    <time dateTime={`PT${lesson.duration}`}>{lesson.duration}</time>
                  </div>
                  <h3>{lesson.title}</h3>
                </div>
                <div className="fundamentals-lesson-actions">
                  {phase === "idle" && (
                    <button
                      type="button"
                      onClick={() => handleStart(lesson)}
                      className="fundamental-action-btn fundamental-action-primary"
                      aria-label={`Iniciar aula ${lesson.title}`}
                    >
                      <Play size={17} aria-hidden="true" />
                      <span>Iniciar aula</span>
                    </button>
                  )}
                  {phase === "playing" && currentLesson?.id === lesson.id && (
                    <div className="fundamental-action-progress" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label={`Progresso da aula ${lesson.title}`}>
                      <Clock size={17} aria-hidden="true" className="progress-spin" />
                      <span>Em andamento — {Math.round(progress)}%</span>
                      <div className="fundamental-progress-track">
                        <div className="fundamental-progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                  {phase === "complete" && currentLesson?.id === lesson.id && (
                    <div className="fundamental-action-success">
                      <CheckCircle size={17} aria-hidden="true" />
                      <span>Aula concluída!</span>
                      <Trophy size={14} aria-hidden="true" className="success-star" />
                    </div>
                  )}
                  {phase !== "idle" && currentLesson?.id !== lesson.id && phase !== "playing" && (
                    <button
                      type="button"
                      disabled
                      className="fundamental-action-btn fundamental-action-muted"
                      aria-label={`Aula ${lesson.title} concluída anteriormente`}
                    >
                      <CheckCircle size={17} aria-hidden="true" />
                      <span>Concluída</span>
                    </button>
                  )}
                  {phase === "playing" && currentLesson?.id !== lesson.id && (
                    <button
                      type="button"
                      disabled
                      className="fundamental-action-btn fundamental-action-muted"
                      aria-label={`Aula ${lesson.title} em espera`}
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

        <div className="fundamentals-summary">
          {phase === "complete" && (
            <div className="fundamentals-summary-card">
              <div className="fundamentals-summary-icon">
                <Trophy size={24} aria-hidden="true" />
              </div>
              <h2>Parabéns!</h2>
              <p>Você concluiu uma aula da Escola Criativa. Continue explorando novas trilhas e expanda suas habilidades artísticas.</p>
              <button
                type="button"
                onClick={handleReset}
                className="fundamental-action-btn fundamental-action-reset"
                aria-label="Voltar ao início e escolher nova aula"
              >
                <RotateCw size={17} aria-hidden="true" />
                <span>Explorar outras aulas</span>
              </button>
            </div>
          )}
          {phase === "idle" && (
            <p className="fundamentals-summary-placeholder">
              Nenhuma aula em andamento. Selecione uma trilha para começar.
            </p>
          )}
        </div>

        <p className="demo-note" role="status" aria-live="polite">
          {phase === "idle" && "Demonstração interativa. Clique em &quot;Iniciar aula&quot; para experimentar os estados."}
          {phase === "playing" && "Aula em progresso. Aguarde a conclusão ou visualize o estado de sucesso."}
          {phase === "complete" && "Aula finalizada. Use &quot;Explorar outras aulas&quot; para resetar."}
        </p>
      </div>
    </section>
  );
}
