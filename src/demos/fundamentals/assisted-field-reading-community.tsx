"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, BookOpen, User, Star, Calendar } from "lucide-react";

type FieldState = "idle" | "focused" | "valid" | "error" | "complete";

export default function AssistedFieldReadingCommunity() {
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    bookTitle: false,
    author: false,
    rating: false,
    notes: false,
  });

  const [fieldStates, setFieldStates] = useState<{ [key: string]: FieldState }>({
    bookTitle: "idle",
    author: "idle",
    rating: "idle",
    notes: "idle",
  });

  const validateBookTitle = (title: string): FieldState => {
    if (!title) return "idle";
    if (title.length < 3) return "error";
    return "valid";
  };

  const validateAuthor = (auth: string): FieldState => {
    if (!auth) return "idle";
    if (auth.length < 3) return "error";
    return "valid";
  };

  const validateRating = (rate: number): FieldState => {
    if (rate === 0) return "idle";
    return "valid";
  };

  const validateNotes = (note: string): FieldState => {
    if (!note) return "idle";
    if (note.length < 10) return "error";
    return "valid";
  };

  const handleBookTitleChange = (val: string) => {
    setBookTitle(val);
    const state = validateBookTitle(val);
    setFieldStates((prev) => ({ ...prev, bookTitle: state }));
  };

  const handleAuthorChange = (val: string) => {
    setAuthor(val);
    const state = validateAuthor(val);
    setFieldStates((prev) => ({ ...prev, author: state }));
  };

  const handleRatingChange = (val: number) => {
    setRating(val);
    const state = validateRating(val);
    setFieldStates((prev) => ({ ...prev, rating: state }));
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    const state = validateNotes(val);
    setFieldStates((prev) => ({ ...prev, notes: state }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getHelpText = (field: string, state: FieldState) => {
    if (state === "idle") {
      if (field === "bookTitle") return "Título do livro para sua lista";
      if (field === "author") return "Nome do autor";
      if (field === "rating") return "Avalie com estrelas";
      return "Suas anotações sobre o livro";
    }
    if (state === "error") {
      if (field === "bookTitle") return "Mínimo 3 caracteres";
      if (field === "author") return "Mínimo 3 caracteres";
      if (field === "rating") return "Selecione uma avaliação";
      return "Mínimo 10 caracteres para anotações";
    }
    if (state === "valid") {
      if (field === "bookTitle") return "Título registrado ✓";
      if (field === "author") return "Autor validado ✓";
      if (field === "rating") return "Avaliação registrada ✓";
      return "Anotações salvas ✓";
    }
    return "";
  };

  const getIcon = (state: FieldState) => {
    if (state === "valid" || state === "complete") {
      return <CheckCircle2 size={18} aria-hidden="true" className="text-amber-800" />;
    }
    if (state === "error") {
      return <AlertCircle size={18} aria-hidden="true" className="text-red-500" />;
    }
    return null;
  };

  const getStateClasses = (state: FieldState) => {
    if (state === "valid" || state === "complete")
      return "border-amber-800 bg-amber-50 focus-within:ring-amber-800";
    if (state === "error")
      return "border-red-500 bg-red-50 focus-within:ring-red-500";
    return "border-stone-400 focus-within:border-amber-900 focus-within:ring-amber-900";
  };

  const allFieldsComplete =
    fieldStates.bookTitle === "valid" &&
    fieldStates.author === "valid" &&
    fieldStates.rating === "valid" &&
    fieldStates.notes === "valid";

  return (
    <section className="demo-reading" aria-label="Campo assistido — Comunidade de Leitura">
      <div className="reading-container">
        <div className="reading-header">
          <span className="demo-kicker">FUNDAMENTOS / 014</span>
          <div className="reading-badge-row">
            <BookOpen size={14} aria-hidden="true" />
            <span>Comunidade de Leitura — Listas e Anotações</span>
          </div>
        </div>

        <div className="reading-hero">
          <div className="reading-hero-content">
            <BookOpen size={28} aria-hidden="true" className="reading-hero-icon" />
            <h1>
              Cada página é um{" "}
              <em>caminho</em> novo.
            </h1>
            <p>
              Compartilhe sua leitura com a comunidade. Campos validados para registrar cada título com carinho — do título às anotações.
            </p>
          </div>
        </div>

        <form className="reading-form" onSubmit={(e) => e.preventDefault()}>
          <div className="reading-field">
            <label htmlFor="read-title" className="reading-label">
              <BookOpen size={16} aria-hidden="true" />
              Título do Livro
            </label>
            <div
              className={`reading-input-wrapper ${getStateClasses(fieldStates.bookTitle)}`}
              role="group"
              aria-label="Título do livro"
            >
              <input
                id="read-title"
                type="text"
                placeholder="Ex: Dom Casmurro, 1984"
                value={bookTitle}
                onChange={(e) => handleBookTitleChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({ ...prev, bookTitle: "focused" }))
                }
                onBlur={() => handleBlur("bookTitle")}
                aria-invalid={fieldStates.bookTitle === "error"}
                aria-describedby="help-title"
                autoComplete="off"
              />
              {getIcon(fieldStates.bookTitle)}
            </div>
            <p
              id="help-title"
              className={`reading-help ${fieldStates.bookTitle === "error" && touched.bookTitle ? "error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("bookTitle", fieldStates.bookTitle)}
            </p>
          </div>

          <div className="reading-field">
            <label htmlFor="read-author" className="reading-label">
              <User size={16} aria-hidden="true" />
              Autor
            </label>
            <div
              className={`reading-input-wrapper ${getStateClasses(fieldStates.author)}`}
              role="group"
              aria-label="Autor"
            >
              <input
                id="read-author"
                type="text"
                placeholder="Ex: Machado de Assis, George Orwell"
                value={author}
                onChange={(e) => handleAuthorChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({ ...prev, author: "focused" }))
                }
                onBlur={() => handleBlur("author")}
                aria-invalid={fieldStates.author === "error"}
                aria-describedby="help-author"
              />
              {getIcon(fieldStates.author)}
            </div>
            <p
              id="help-author"
              className={`reading-help ${fieldStates.author === "error" && touched.author ? "error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("author", fieldStates.author)}
            </p>
          </div>

          <div className="reading-field">
            <label className="reading-label">
              <Star size={16} aria-hidden="true" />
              Avaliação
            </label>
            <div
              className={`reading-input-wrapper ${getStateClasses(fieldStates.rating)}`}
              role="group"
              aria-label="Avaliação com estrelas"
            >
              <div className="reading-star-rating" role="radiogroup" aria-label="Escolha de 1 a 5 estrelas">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className={`reading-star-btn ${star <= rating ? "is-active" : ""}`}
                    aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
                    aria-checked={star === rating}
                    role="radio"
                  >
                    <Star size={24} fill={star <= rating ? "#b45309" : "none"} />
                  </button>
                ))}
              </div>
              {getIcon(fieldStates.rating)}
            </div>
            <p
              id="help-rating"
              className={`reading-help ${fieldStates.rating === "error" && touched.rating ? "error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("rating", fieldStates.rating)}
            </p>
          </div>

          <div className="reading-field">
            <label htmlFor="read-notes" className="reading-label">
              <Calendar size={16} aria-hidden="true" />
              Anotações
            </label>
            <div
              className={`reading-input-wrapper reading-textarea-wrapper ${getStateClasses(fieldStates.notes)}`}
              role="group"
              aria-label="Anotações"
            >
              <textarea
                id="read-notes"
                placeholder="Compartilhe suas reflexões sobre o livro..."
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                onFocus={() =>
                  setFieldStates((prev) => ({ ...prev, notes: "focused" }))
                }
                onBlur={() => handleBlur("notes")}
                aria-invalid={fieldStates.notes === "error"}
                aria-describedby="help-notes"
                rows={4}
              />
              {getIcon(fieldStates.notes)}
            </div>
            <p
              id="help-notes"
              className={`reading-help ${fieldStates.notes === "error" && touched.notes ? "error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("notes", fieldStates.notes)}
            </p>
          </div>

          <div className="reading-actions">
            <button
              type="submit"
              disabled={!allFieldsComplete}
              className={`reading-submit-btn ${allFieldsComplete ? "is-active" : ""}`}
              aria-label="Compartilhar leitura"
            >
              <BookOpen size={18} aria-hidden="true" />
              Compartilhar Leitura
            </button>
            {allFieldsComplete && (
              <div className="reading-success" role="status" aria-live="polite">
                <CheckCircle2 size={16} aria-hidden="true" />
                <span>Leitura registrada com sucesso!</span>
              </div>
            )}
          </div>
        </form>

        <p className="reading-footer">
          Demonstração interativa. Nenhum dado é enviado para servidores.
        </p>
      </div>
    </section>
  );
}
