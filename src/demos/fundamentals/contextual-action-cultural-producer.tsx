"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, Ticket, CheckCircle, Clock, MapPin, Users, Music, Palette, Film } from "lucide-react";

type EventPhase = "idle" | "reserving" | "reserved";
type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  price: string;
  category: string;
  icon: typeof Music;
  color: string;
  seatsLeft: number;
};

const events: Event[] = [
  {
    id: 1,
    title: "Noite de Jazz & Vinho",
    date: "2026-10-15",
    time: "20h",
    venue: "Espaço Cultural Memória",
    price: "R$ 85",
    category: "Música",
    icon: Music,
    color: "#8b5cf6",
    seatsLeft: 42,
  },
  {
    id: 2,
    title: "Instalação — Luzes Urbanas",
    date: "2026-10-22",
    time: "18h",
    venue: "Galeria Norte",
    price: "R$ 45",
    category: "Arte",
    icon: Palette,
    color: "#f59e0b",
    seatsLeft: 18,
  },
  {
    id: 3,
    title: "Cine Debate — Realidade Local",
    date: "2026-11-03",
    time: "19h",
    venue: "Cinema Artístico Pátio",
    price: "R$ 30",
    category: "Cinema",
    icon: Film,
    color: "#ec4899",
    seatsLeft: 7,
  },
];

function generateTicketNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 1000000).toString(36).toUpperCase().padStart(6, "0");
  return `TCK-${timestamp}-${random.substring(0, 4)}`;
}

export default function ContextualActionCulturalProducer() {
  const [phase, setPhase] = useState<EventPhase>("idle");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [progress, setProgress] = useState(0);
  const [ticketNumber, setTicketNumber] = useState("");
  const [reservedSeat, setReservedSeat] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  function handleReserve(event: Event) {
    if (phase === "reserving") return;
    setSelectedEvent(event);
    setPhase("reserving");
    setProgress(0);
    setTicketNumber("");
    setReservedSeat("");

    timerRef.current = setTimeout(() => {
      setPhase("reserved");
      setTicketNumber(generateTicketNumber());
      const seatRow = String.fromCharCode(65 + Math.floor(Math.random() * 8));
      const seatNum = Math.floor(Math.random() * 20) + 1;
      setReservedSeat(`L${seatRow} - C${seatNum}`);
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
    setSelectedEvent(null);
    setProgress(0);
    setTicketNumber("");
    setReservedSeat("");
  }

  return (
    <section className="demo-cultural" aria-label="Ação contextual — Produtora Cultural">
      <div className="cultural-stage">
        <div className="cultural-header">
          <span className="demo-kicker">FUNDAMENTOS / 009</span>
          <div className="cultural-badge-row">
            <Ticket size={14} aria-hidden="true" />
            <span>Produtora Cultural — Programação de Eventos</span>
          </div>
        </div>

        <div className="cultural-hero">
          <div className="cultural-hero-content">
            <Calendar size={28} aria-hidden="true" className="cultural-hero-icon" />
            <h1>
              Cultura que <em>acontece</em>.
            </h1>
            <p>
              Eventos selecionados para quem vive arte. Escolha um evento, reserve seu ingresso e receba a confirmação instantânea.
            </p>
          </div>
        </div>

        <div className="cultural-events">
          <h2>Próximos eventos</h2>
          <div className="cultural-event-list">
            {events.map((event) => {
              const isReserved = phase === "reserved" && selectedEvent?.id === event.id;
              const isSelected = phase !== "idle" && selectedEvent?.id === event.id;
              return (
                <article
                  key={event.id}
                  className={`cultural-event-card ${isSelected ? "is-selected" : ""} ${isReserved ? "is-reserved" : ""} ${event.seatsLeft <= 10 ? "is-low-seats" : ""}`}
                >
                  <div className="cultural-event-info">
                    <div className="cultural-event-meta">
                      <span
                        className="cultural-event-category-badge"
                        style={{ backgroundColor: event.color }}
                      >
                        {event.category}
                      </span>
                      <div className="cultural-event-datetime">
                        <time dateTime={event.date}>
                          {new Date(event.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </time>
                        <span className="separator">·</span>
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <h3>{event.title}</h3>
                    <div className="cultural-event-venue">
                      <MapPin size={14} aria-hidden="true" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="cultural-event-footer">
                      <span className="cultural-event-price">{event.price}</span>
                      <div className="cultural-event-seats">
                        <Users size={12} aria-hidden="true" />
                        <span className={event.seatsLeft <= 10 ? "low-seats-text" : ""}>
                          {event.seatsLeft <= 10
                            ? `Apenas ${event.seatsLeft} lugares`
                            : `${event.seatsLeft} lugares`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="cultural-event-actions">
                    {phase === "idle" && (
                      <button
                        type="button"
                        onClick={() => handleReserve(event)}
                        className="cultural-reserve-btn cultural-reserve-primary"
                        aria-label={`Reservar ingresso para ${event.title}`}
                      >
                        <Ticket size={16} aria-hidden="true" />
                        Reservar Ingresso
                      </button>
                    )}
                    {phase === "reserving" && isSelected && (
                      <div className="cultural-reserving-state" role="status" aria-live="polite">
                        <div className="cultural-progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso da reserva">
                          <div
                            className="cultural-progress-fill"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span>Reservando seu ingresso...</span>
                      </div>
                    )}
                    {isReserved && (
                      <div className="cultural-reserved-state" role="status" aria-live="polite">
                        <CheckCircle size={16} aria-hidden="true" />
                        <span>Confirmado!</span>
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
            className={`cultural-result-panel ${phase === "reserved" ? "is-visible" : ""}`}
            role="region"
            aria-label="Resultado da reserva"
          >
            {phase === "reserved" && ticketNumber ? (
              <div className="cultural-result-content">
                <div className="cultural-result-header">
                  <CheckCircle size={32} aria-hidden="true" />
                  <h3>Ingresso Confirmado</h3>
                </div>
                {selectedEvent && (
                  <div className="cultural-result-event">
                    <h4>{selectedEvent.title}</h4>
                    <div className="cultural-result-details">
                      <div className="result-item">
                        <Calendar size={14} aria-hidden="true" />
                        <span>
                          {new Date(selectedEvent.date).toLocaleDateString("pt-BR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}{" "}
                          às {selectedEvent.time}
                        </span>
                      </div>
                      <div className="result-item">
                        <MapPin size={14} aria-hidden="true" />
                        <span>{selectedEvent.venue}</span>
                      </div>
                      <div className="result-item">
                        <Ticket size={14} aria-hidden="true" />
                        <span>Assento: {reservedSeat}</span>
                      </div>
                      <div className="result-item">
                        <Clock size={14} aria-hidden="true" />
                        <span>Código: {ticketNumber}</span>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleReset}
                  className="cultural-new-reserve-btn"
                  aria-label="Fazer nova reserva"
                >
                  Nova Reserva
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
