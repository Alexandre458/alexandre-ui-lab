"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Calendar, CheckCircle2, LoaderCircle, MapPin, Ticket } from "lucide-react";

/*
 * Dados locais e fictícios: a programação de primavera da produtora cultural.
 * Nada é enviado a serviços reais — o bilhete existe só neste navegador.
 */
type Show = {
  id: string;
  titulo: string;
  genero: string;
  data: string;
  hora: string;
  local: string;
  preco: string;
  lugares: number;
  maxin: number;
  resumo: string;
};

const PROGRAMACAO: Show[] = [
  {
    id: "jazz",
    titulo: "Ritmo & Vinil — Noite de Jazz",
    genero: "Música",
    data: "2026-10-10T20:00:00-03:00",
    hora: "20h",
    local: "Clube Memória",
    preco: "R$ 60",
    lugares: 24,
    maxin: 8,
    resumo: "Trio acústico, vinilos ao vivo e adega curta no subsolo do clube.",
  },
  {
    id: "teatro",
    titulo: "Cena Aberta — Teatro Experimental",
    genero: "Teatro",
    data: "2026-10-18T19:30:00-03:00",
    hora: "19h30",
    local: "Teatro do Vale",
    preco: "R$ 35",
    lugares: 9,
    maxin: 9,
    resumo: "Duas leituras encenadas num mesmo palco, com plateia em pé.",
  },
  {
    id: "exposicao",
    titulo: "Corpo & Espaço — Exposição Coletiva",
    genero: "Artes visuais",
    data: "2026-11-01T16:00:00-03:00",
    hora: "16h",
    local: "Galeria Norte",
    preco: "R$ 20",
    lugares: 61,
    maxin: 8,
    resumo: "Cinco artistas locais ocupam a sala grande por quatro semanas.",
  },
];

const formatarData = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", timeZone: "America/Sao_Paulo" });

function gerarCodigo(
  showId: string,
  quantidade: number,
  nome: string,
  email: string,
) {
  const seed = `${showId}|${quantidade}|${nome.trim().toLocaleLowerCase("pt-BR")}|${email.trim().toLocaleLowerCase("pt-BR")}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return `CULT-19-${hash.toString(36).toUpperCase().padStart(4, "0").slice(-4)}`;
}

type Fase = "repouso" | "gerando" | "pronto";

function validarNome(nome: string): string | null {
  const limpo = nome.trim();
  if (limpo.length < 3) return "Use pelo menos 3 letras (aceita acentos e espaços).";
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(limpo))
    return "Use apenas letras, espaços, hífen ou apóstrofo.";
  return null;
}

function validarEmail(email: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
    return "Confira o formato do e-mail, por exemplo nome@exemplo.com.";
  return null;
}

export default function AssistedFieldCulturalProducer() {
  const [showId, setShowId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [fase, setFase] = useState<Fase>("repouso");
  const [codigo, setCodigo] = useState("");
  const [letreiroAtivo, setLetreiroAtivo] = useState(true);
  const timer = useRef<number | null>(null);
  const seletor = useRef<HTMLSelectElement>(null);
  const bilhete = useRef<HTMLDivElement>(null);
  const restaurarFoco = useRef(false);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (fase === "pronto") bilhete.current?.focus();
    if (fase === "repouso" && restaurarFoco.current) {
      seletor.current?.focus();
      restaurarFoco.current = false;
    }
  }, [fase]);

  const show = PROGRAMACAO.find((s) => s.id === showId) ?? null;
  const trava = fase === "gerando" || fase === "pronto";
  const limite = Math.min(show?.maxin ?? 8, show?.lugares ?? 8);

  const qNumerico = Number(quantidade.trim());
  const qValido =
    quantidade.trim() !== "" && Number.isInteger(qNumerico) && qNumerico >= 1 && qNumerico <= limite;
  const quantidadeErro = quantidade.trim() !== "" && !qValido;
  const nomeErro = nome.trim() === "" ? null : validarNome(nome);
  const emailErro = email.trim() === "" ? null : validarEmail(email);
  const pronto =
    show !== null && qValido && validarNome(nome) === null && validarEmail(email) === null;

  function gerarBilhetes() {
    if (!pronto || fase !== "repouso" || timer.current !== null) return;
    setFase("gerando");
    setCodigo(gerarCodigo(show!.id, qNumerico, nome, email));
    timer.current = window.setTimeout(() => {
      timer.current = null;
      setFase("pronto");
    }, 700);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    gerarBilhetes();
  }

  function novoPedido() {
    restaurarFoco.current = true;
    setFase("repouso");
    setShowId("");
    setCodigo("");
    setQuantidade("");
    setNome("");
    setEmail("");
  }

  const dicaShow =
    show === null
      ? "Escolha um show da programação de primavera."
      : `Selecionado — ${show.titulo} (${show.lugares} lugares restantes).`;
  const dicaQ =
    show === null
      ? "Escolha primeiro o show para ver o limite."
      : qValido
        ? `Quantidade ok — ${qNumerico} ingresso${qNumerico > 1 ? "s" : ""}.`
        : quantidade.trim() === ""
          ? `Digite de 1 a ${limite} por pedido (${show.lugares} lugares restantes).`
          : `Use um número inteiro entre 1 e ${limite}.`;
  const dicaNome =
    nome.trim() === ""
      ? "Essa é a forma como o bilhete local será impresso."
      : nomeErro ?? "Nome ok — o bilhete sai com esse nome.";
  const dicaEmail =
    email.trim() === ""
      ? "Somente demonstração: o bilhete local é mostrado aqui na tela."
      : emailErro ?? "E-mail ok — nada sai deste navegador.";

  return (
    <section className="prod-stage" aria-label="Buro de ingressos da produtora cultural">
      <div className="prod-shell">
        <header className="prod-topo">
          <span className="prod-kicker">Fundamentos / 019</span>
          <span className="prod-selo">
            <Ticket size={13} aria-hidden="true" />
            Buro de Ingressos — produtora cultural
          </span>
          <button type="button" className="prod-pausa" aria-pressed={!letreiroAtivo} onClick={() => setLetreiroAtivo((ativo) => !ativo)}>
            {letreiroAtivo ? "Pausar letreiro" : "Retomar letreiro"}
          </button>
        </header>

        <div className="prod-letreiro" aria-hidden="true">
          <div className="prod-letreiro-trilha" style={{ animationPlayState: letreiroAtivo ? "running" : "paused" }}>
            {[...PROGRAMACAO, ...PROGRAMACAO].map((s, i) => (
              <span key={`${s.id}-${i}`}>
                {s.titulo} — {formatarData(s.data)} — {s.local}
              </span>
            ))}
          </div>
        </div>

        <div className="prod-cena">
          <div className="prod-apresentacao">
            <h1>
              A primavera da casa,
              <br />
              <em>bilhete por bilhete.</em>
            </h1>
            <p className="prod-sub">
              Reserve um lugar na programação de primavera com campos assistidos:
              escolha o show, confira o limite, escreva nome e e-mail e receba o
              bilhete local na hora.
            </p>
            <ul className="prod-programa" aria-label="Programação de primavera">
              {PROGRAMACAO.map((s) => (
                <li key={s.id} className={showId === s.id ? "atual" : ""}>
                  <span className="prod-prog-data">{formatarData(s.data)}</span>
                  <span className="prod-prog-corpo">
                    <strong>{s.titulo}</strong>
                    <span>
                      {s.genero} · {s.local} · {s.preco}
                    </span>
                  </span>
                  <span className="prod-prog-lugares">{s.lugares} lugares</span>
                </li>
              ))}
            </ul>
          </div>

          <form className="prod-bilheteria" onSubmit={submit} noValidate aria-busy={fase === "gerando"} onKeyDown={(event) => {
            // O iframe permite scripts, mas não submissão nativa de formulários.
            if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
              event.preventDefault();
              gerarBilhetes();
            }
          }}>
            <div className="prod-cab-bilhetes">
              <Ticket size={18} aria-hidden="true" />
              <h2>Bilheteria</h2>
            </div>

            <div className="prod-campo">
              <label className="prod-rotulo" htmlFor="prod-show">
                Show da programação
              </label>
              <select
                id="prod-show"
                ref={seletor}
                className="prod-input"
                value={showId}
                onChange={(ev) => setShowId(ev.target.value)}
                disabled={trava}
                required
                aria-describedby="prod-show-dica"
              >
                <option value="">Escolha o show…</option>
                {PROGRAMACAO.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.titulo} — {s.preco}
                  </option>
                ))}
              </select>
              <span id="prod-show-dica" className="prod-dica" role="note">
                {dicaShow}
              </span>
            </div>

            {show && (
              <div className="prod-campo">
                <label className="prod-rotulo" htmlFor="prod-quantidade">
                  Quantidade de ingressos
                </label>
                <input
                  id="prod-quantidade"
                  className={`prod-input ${qValido ? "ok" : quantidadeErro ? "erro" : ""}`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={limite}
                  step={1}
                  required
                  placeholder={`1 a ${limite}`}
                  value={quantidade}
                  onChange={(ev) => setQuantidade(ev.target.value)}
                  disabled={trava}
                  aria-invalid={!qValido && quantidade.trim() !== "" ? "true" : undefined}
                  aria-describedby="prod-quantidade-dica"
                />
                <span id="prod-quantidade-dica" className={`prod-dica ${quantidadeErro ? "alerta" : ""}`} role="note">
                  {dicaQ}
                </span>
              </div>
            )}

            <div className="prod-campo">
              <label className="prod-rotulo" htmlFor="prod-nome">
                Nome do participante
              </label>
              <input
                id="prod-nome"
                className={`prod-input ${nomeErro ? "erro" : nome.trim() ? "ok" : ""}`}
                type="text"
                required
                maxLength={80}
                autoComplete="name"
                placeholder="Como deve constar no bilhete"
                value={nome}
                onChange={(ev) => setNome(ev.target.value)}
                disabled={trava}
                aria-invalid={nomeErro ? "true" : undefined}
                aria-describedby="prod-nome-dica"
              />
              <span id="prod-nome-dica" className={`prod-dica ${nomeErro ? "alerta" : ""}`} role="note">
                {dicaNome}
              </span>
            </div>

            <div className="prod-campo">
              <label className="prod-rotulo" htmlFor="prod-email">
                E-mail para o bilhete
              </label>
              <input
                id="prod-email"
                className={`prod-input ${emailErro ? "erro" : email.trim() ? "ok" : ""}`}
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="nome@exemplo.com"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                disabled={trava}
                aria-invalid={emailErro ? "true" : undefined}
                aria-describedby="prod-email-dica"
              />
              <span id="prod-email-dica" className={`prod-dica ${emailErro ? "alerta" : ""}`} role="note">
                {dicaEmail}
              </span>
            </div>

            <button
              type="button"
              onClick={gerarBilhetes}
              className="prod-botao"
              disabled={!pronto || trava}
            >
              {fase === "pronto" ? (
                <>
                  <CheckCircle2 size={16} aria-hidden="true" /> Bilhetes gerados
                </>
              ) : fase === "gerando" ? (
                <>
                  <LoaderCircle className="prod-gira" size={16} aria-hidden="true" />{" "}
                  Gerando bilhetes locais…
                </>
              ) : (
                <>
                  <Ticket size={16} aria-hidden="true" /> Gerar bilhetes
                </>
              )}
            </button>

            {fase === "pronto" && show && (
              <>
                <span className="prod-status" role="status">
                  Bilhetes gerados — código <strong>{codigo}</strong>. Nenhum dado
                  foi a serviço externo.
                </span>
                <div className="prod-bilhete" ref={bilhete} tabIndex={-1} role="region" aria-label="Bilhete local gerado">
                  <div className="prod-bilhete-maior">
                    <Calendar size={13} aria-hidden="true" />
                    <span>{formatarData(show.data)} · {show.hora}</span>
                  </div>
                  {show && (
                    <div className="prod-bilhete-titulo">{show.titulo}</div>
                  )}
                  <div className="prod-bilhete-linha">
                    <MapPin size={13} aria-hidden="true" /> {show.local} ·{" "}
                    {show.preco}
                  </div>
                  <div className="prod-bilhete-linha">
                    {qNumerico} ingresso{qNumerico > 1 ? "s" : ""} · {nome.trim()}
                  </div>
                  <div className="prod-bilhete-linha">{email.trim()}</div>
                  <div className="prod-bilhete-estelo">
                    <span className="prod-code">{codigo}</span>
                    <span>uso local · sem envio</span>
                  </div>
                </div>
              </>
            )}

            {fase === "pronto" && (
              <button
                type="button"
                className="prod-botao-secundario"
                onClick={novoPedido}
              >
                Novo pedido
              </button>
            )}

            <p className="prod-nota">
              Demonstração com dados fictícios da casa. O “envio” é simulado na
              própria página — nada sai deste navegador.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
