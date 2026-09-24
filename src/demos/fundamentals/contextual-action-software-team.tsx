"use client";

import { useState, useEffect, useRef } from "react";
import {
  CircleHelp,
  Rocket,
  CheckCircle,
  Clock,
  GitBranch,
  Bug,
  ArrowRight,
} from "lucide-react";

type TaskPhase = "idle" | "deploying" | "deployed";
type Task = {
  id: number;
  title: string;
  type: "feature" | "bugfix" | "hotfix";
  priority: "alta" | "média" | "baixa";
  branch: string;
  assignee: string;
};

const tasks: Task[] = [
  {
    id: 1,
    title: "Implementar autenticação OAuth2",
    type: "feature",
    priority: "alta",
    branch: "feat/oauth2-login",
    assignee: "Ana Silva",
  },
  {
    id: 2,
    title: "Corrigir vazamento de memória no websocket",
    type: "bugfix",
    priority: "alta",
    branch: "fix/ws-memory-leak",
    assignee: "Carlos Mendes",
  },
  {
    id: 3,
    title: "Atualizar dependências do React",
    type: "hotfix",
    priority: "média",
    branch: "chore/update-react-deps",
    assignee: "Mariana Costa",
  },
];

function generateDeployId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 1000000).toString(36).toUpperCase().padStart(6, "0");
  return `DEP-${timestamp}-${random.substring(0, 4)}`;
}

export default function ContextualActionSoftwareTeam() {
  const [phase, setPhase] = useState<TaskPhase>("idle");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [progress, setProgress] = useState(0);
  const [deployId, setDeployId] = useState("");
  const [deployUrl, setDeployUrl] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  function handleDeploy(task: Task) {
    if (phase === "deploying") return;
    setSelectedTask(task);
    setPhase("deploying");
    setProgress(0);
    setDeployId("");
    setDeployUrl("");

    timerRef.current = setTimeout(() => {
      setPhase("deployed");
      setDeployId(generateDeployId());
      setDeployUrl(`https://deploy.example.app/${generateDeployId().toLowerCase()}`);
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
    setSelectedTask(null);
    setProgress(0);
    setDeployId("");
    setDeployUrl("");
  }

  const getTypeIcon = (type: string) => {
    if (type === "feature") return <GitBranch size={14} aria-hidden="true" />;
    if (type === "bugfix") return <Bug size={14} aria-hidden="true" />;
    return <ArrowRight size={14} aria-hidden="true" />;
  };

  const getTypeColor = (type: string) => {
    if (type === "feature") return "#3b82f6";
    if (type === "bugfix") return "#ef4444";
    return "#f59e0b";
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === "alta") return { label: "Alta", color: "#ef4444" };
    if (priority === "média") return { label: "Média", color: "#f59e0b" };
    return { label: "Baixa", color: "#22c55e" };
  };

  return (
    <section className="demo-software" aria-label="Ação contextual — Equipe de Software">
      <div className="software-stage">
        <div className="software-header">
          <span className="demo-kicker">FUNDAMENTOS / 010</span>
          <div className="software-badge-row">
            <CircleHelp size={14} aria-hidden="true" />
            <span>Equipe de Software — Pipeline de Deploy</span>
          </div>
        </div>

        <div className="software-hero">
          <div className="software-hero-content">
            <Rocket size={28} aria-hidden="true" className="software-hero-icon" />
            <h1>
              Deploy que <em>entrega</em>.
            </h1>
            <p>
              Sua equipe precisa de velocidade e confiança. Selecione uma tarefa, inicie o deploy e acompanhe a confirmação em tempo real.
            </p>
          </div>
        </div>

        <div className="software-tasks">
          <h2>Tarefas na fila</h2>
          <div className="software-task-list">
            {tasks.map((task) => {
              const isDeployed = phase === "deployed" && selectedTask?.id === task.id;
              const isSelected = phase !== "idle" && selectedTask?.id === task.id;
              const priorityBadge = getPriorityBadge(task.priority);
              return (
                <article
                  key={task.id}
                  className={`software-task-card ${isSelected ? "is-selected" : ""} ${isDeployed ? "is-deployed" : ""}`}
                >
                  <div className="software-task-info">
                    <div className="software-task-meta">
                      <span
                        className="software-task-type-badge"
                        style={{ backgroundColor: getTypeColor(task.type) }}
                      >
                        {getTypeIcon(task.type)}
                        <span>{task.type.toUpperCase()}</span>
                      </span>
                      <span
                        className="software-priority-badge"
                        style={{ backgroundColor: priorityBadge.color }}
                      >
                        {priorityBadge.label}
                      </span>
                    </div>
                    <h3>{task.title}</h3>
                    <div className="software-task-details">
                      <div className="task-detail">
                        <GitBranch size={14} aria-hidden="true" />
                        <span className="branch-name">{task.branch}</span>
                      </div>
                      <div className="task-detail">
                        <Clock size={14} aria-hidden="true" />
                        <span>{task.assignee}</span>
                      </div>
                    </div>
                  </div>
                  <div className="software-task-actions">
                    {phase === "idle" && (
                      <button
                        type="button"
                        onClick={() => handleDeploy(task)}
                        className="software-deploy-btn software-deploy-primary"
                        aria-label={`Iniciar deploy de ${task.title}`}
                      >
                        <Rocket size={16} aria-hidden="true" />
                        Iniciar Deploy
                      </button>
                    )}
                    {phase === "deploying" && isSelected && (
                      <div className="software-deploying-state" role="status" aria-live="polite">
                        <div className="software-progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do deploy">
                          <div
                            className="software-progress-fill"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span>Deploy em progresso...</span>
                      </div>
                    )}
                    {isDeployed && (
                      <div className="software-deployed-state" role="status" aria-live="polite">
                        <CheckCircle size={16} aria-hidden="true" />
                        <span>Deploy concluído!</span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {phase !== "idle" && (
          <div
            className={`software-result-panel ${phase === "deployed" ? "is-visible" : ""}`}
            role="region"
            aria-label="Resultado do deploy"
          >
            {phase === "deployed" && deployId ? (
              <div className="software-result-content">
                <div className="software-result-header">
                  <CheckCircle size={32} aria-hidden="true" />
                  <h3>Deploy Confirmado</h3>
                </div>
                {selectedTask && (
                  <div className="software-result-task">
                    <h4>{selectedTask.title}</h4>
                    <div className="software-result-details">
                      <div className="result-item">
                        <Rocket size={14} aria-hidden="true" />
                        <span>Deploy ID: {deployId}</span>
                      </div>
                      <div className="result-item">
                        <GitBranch size={14} aria-hidden="true" />
                        <span>Branch: {selectedTask.branch}</span>
                      </div>
                      <div className="result-item">
                        <Clock size={14} aria-hidden="true" />
                        <span>Responsável: {selectedTask.assignee}</span>
                      </div>
                      <div className="result-item deploy-url-item">
                        <ArrowRight size={14} aria-hidden="true" />
                        <a
                          href={deployUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="deploy-url"
                        >
                          {deployUrl}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleReset}
                  className="software-new-deploy-btn"
                  aria-label="Fazer novo deploy"
                >
                  Novo Deploy
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
