"use client";

import { useMemo, useRef, useState } from "react";
import { Check, GitBranch, GitFork, Lock, RotateCcw, Search, TriangleAlert, Wrench } from "lucide-react";

const PREFIXOS = ["feature", "fix"] as const;
type Prefixo = (typeof PREFIXOS)[number];

type RamoLocal = { nome: string; autor: string; data: string };

/* Fixture local: fix/login já existe; main é reservada; feature/Minha Tela é o caso de referência. */
const RAMOS_LOCAIS: RamoLocal[] = [
  { nome: "main", autor: "repositório", data: "01/10" },
  { nome: "feature/melhorias-ui", autor: "A. Souza", data: "12/09" },
  { nome: "feature/seo-basics", autor: "M. Lima", data: "18/09" },
  { nome: "feature/painel-de-login", autor: "R. Nunes", data: "27/09" },
  { nome: "fix/login", autor: "A. Souza", data: "02/10" },
  { nome: "fix/ajustes-de-layout", autor: "R. Nunes", data: "03/10" },
  { nome: "fix/erro-de-cache", autor: "M. Lima", data: "03/10" },
];

const NOME_RESERVADOS = ["main", "master", "develop", "release", "prod", "staging"];

const ESTADO_INICIAL = { prefixo: "feature" as Prefixo, nome: "Minha Tela", msg: "Sandbox pronto: feature/minha-tela está livre." };

/* Demo só client (ssr:false): hora de referência fixa no carregamento do módulo. */
const TEMPO_BASE = Date.now();

type Snapshot = { prefixo: Prefixo; nome: string };
type Lote = { id: number; slug: string; estado: "livre" | "reservado" | "colisão"; hora: string };

function normalizaNome(nome: string): string {
  return nome.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}

function diagnosticar(prefixo: Prefixo, nome: string) {
  const slug = normalizaNome(nome);
  if (!slug) return { tipo: "vazio" as const, slug, completo: "" };
  const completo = `${prefixo}/${slug}`;
  if (NOME_RESERVADOS.includes(slug)) return { tipo: "reservado" as const, slug, completo };
  const ramo = RAMOS_LOCAIS.find(item => item.nome === completo);
  if (ramo) {
    const ocupadas = new Set([...NOME_RESERVADOS, ...RAMOS_LOCAIS.map(item => item.nome)]);
    const sufixos = ["-novo", "-v2", "-v3"];
    const sugestao = sufixos.map(extra => `${prefixo}/${slug}${extra}`).find(candidata => !ocupadas.has(candidata));
    return { tipo: "colisao" as const, slug, completo, ramo, sugestao };
  }
  return { tipo: "ok" as const, slug, completo };
}

function nomeLegivel(sugestaoCompleta: string): string {
  return sugestaoCompleta.split("/")[1] ?? "";
}

const ROTULOS: Record<string, string> = { ok: "livre", vazio: "aguardando nome", reservado: "reservado", colisao: "colisão" };

export default function EditorDeIdentificadorDeBranch() {
  const [prefixo, setPrefixo] = useState<Prefixo>(ESTADO_INICIAL.prefixo);
  const [nome, setNome] = useState(ESTADO_INICIAL.nome);
  const [msg, setMsg] = useState(ESTADO_INICIAL.msg);
  const [pilha, setPilha] = useState<Snapshot[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const sequencia = useRef(0);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const nomeRef = useRef<HTMLInputElement>(null);
  const diagnostico = useMemo(() => diagnosticar(prefixo, nome), [prefixo, nome]);
  const invalido = diagnostico.tipo === "reservado" || diagnostico.tipo === "colisao";

  const horaLote = (id: number) => new Date(TEMPO_BASE + id * 47000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const anunciar = (texto: string) => {
    setMsg(texto);
    // foco síncrono: sem rAF, nenhum frame posterior pode roubar o foco do input
    statusRef.current?.focus();
  };

  const aoDigitar = (valor: string) => {
    setNome(valor);
    const item = diagnosticar(prefixo, valor);
    setMsg(`Prévia normalizada: ${item.completo || "—"} (${ROTULOS[item.tipo]}).`);
  };

  const aoTrocarPrefixo = (valor: Prefixo) => {
    setPrefixo(valor);
    const item = diagnosticar(valor, nome);
    setMsg(`Prefixo ${valor}/ aplicado: ${item.completo || "—"} (${ROTULOS[item.tipo]}).`);
  };

  const avaliacaoAtual = () => {
    if (diagnostico.tipo === "vazio") return "Escreva o nome para avaliar o identificador.";
    if (diagnostico.tipo === "ok") return `Identificador livre: ${diagnostico.completo} existe em nenhum dos ${RAMOS_LOCAIS.length} ramos locais.`;
    if (diagnostico.tipo === "reservado") return `Nome reservado: «${diagnostico.slug}» pertence aos ramos padrão do repositório.`;
    return `Colisão: ${diagnostico.completo} já existe (aberto por ${diagnostico.ramo?.autor} em ${diagnostico.ramo?.data}).`;
  };

  const aoAvaliar = () => {
    anunciar(avaliacaoAtual());
    if (diagnostico.tipo !== "vazio") {
      sequencia.current += 1;
      const id = sequencia.current;
      const novo: Lote = {
        id,
        slug: diagnostico.completo,
        estado: diagnostico.tipo === "ok" ? "livre" : diagnostico.tipo === "reservado" ? "reservado" : "colisão",
        hora: horaLote(id),
      };
      setLotes(valor => [novo, ...valor].slice(0, 4));
    }
  };

  const corrigir = () => {
    if (diagnostico.tipo !== "colisao" || !diagnostico.sugestao) return;
    setPilha(valor => [...valor, { prefixo, nome }].slice(-5));
    const novoNome = nomeLegivel(diagnostico.sugestao);
    setNome(novoNome);
    anunciar(`Correção aplicada: ${diagnostico.completo} virou ${diagnostico.sugestao}, que está livre.`);
  };

  const desfazer = () => {
    if (pilha.length === 0) return;
    const ultimo = pilha[pilha.length - 1];
    setPrefixo(ultimo.prefixo);
    setNome(ultimo.nome);
    setPilha(valor => valor.slice(0, -1));
    const item = diagnosticar(ultimo.prefixo, ultimo.nome);
    const label = ROTULOS[item.tipo] ?? item.tipo;
    anunciar(`Desfeito: o editor voltou a ${item.completo || "ficar esperando"} (${label}).`);
  };

  const reiniciar = () => {
    setPrefixo(ESTADO_INICIAL.prefixo);
    setNome(ESTADO_INICIAL.nome);
    setPilha([]);
    setLotes([]);
    setMsg(ESTADO_INICIAL.msg);
    requestAnimationFrame(() => nomeRef.current?.focus());
  };

  const aoEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
    // O <p role="status"> só recebe foco programático (tabIndex=-1); aceitá-lo
    // como alvo mantém a reavaliação estável mesmo se o foco tiver ido para ele.
    if (event.target !== nomeRef.current && event.target !== statusRef.current) return;
    event.preventDefault();
    nomeRef.current?.focus();
    aoAvaliar();
  };

  const descricao = invalido
    ? diagnostico.tipo === "reservado"
      ? `«${diagnostico.slug}» é reservado pelos ramos padrão deste repositório. Use um nome que descreba a mudança.`
      : `${diagnostico.completo} já existe neste sandbox. Avalie, corrija para ${diagnostico.sugestao ?? "um sufixo disponível"} ou desfaça.`
    : "A prévia é normalizada em tempo real: minúsculas, sem acentos e espaços virando hífens.";

  return (
    <section className="branch-stage" aria-labelledby="branch-titulo">
      <div className="branch-topo">
        <span className="branch-chip"><GitBranch size={13} aria-hidden /> sandbox git local</span>
        <span className="branch-chip neutral">ramo atual: main</span>
        <span className="branch-chip neutral">{new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
      </div>

      <h1 id="branch-titulo" className="branch-titulo">Editor de <span>identificador de branch</span></h1>
      <p className="branch-lema">Escolha o prefixo, escreva o que você está fazendo e veja o nome chegar pronto para <code>git checkout -b</code>. Se o identificador colidir com um ramo local ou com um nome reservado, o diagnóstico aparece ao lado — e a correção age sobre a causa, nunca sobre outro ramo.</p>

      <form className="branch-editor" aria-label="Editor de uma linha de identificador de branch" noValidate onSubmit={event => event.preventDefault()} onKeyDown={aoEnter}>
        <div className="branch-editor-linha">
          <div className="branch-bloco">
            <span className="branch-rotulo" aria-hidden="true">Prefixo</span>
            <div className="branch-segmento" role="group" aria-label="Prefixo do identificador">
              {PREFIXOS.map(item => (
                <button key={item} type="button" className={`branch-seg${prefixo === item ? " ativo" : ""}`} aria-pressed={prefixo === item} onClick={() => aoTrocarPrefixo(item)}>{item}/</button>
              ))}
            </div>
          </div>
          <div className="branch-bloco nome">
            <label className="branch-rotulo" htmlFor="branch-nome">Nome</label>
            <input
              id="branch-nome"
              ref={nomeRef}
              className={`branch-campo${invalido ? " invalido" : ""}`}
              type="text"
              value={nome}
              placeholder="ex.: Minha Tela"
              autoComplete="off"
              spellCheck={false}
              autoCapitalize="off"
              onChange={event => aoDigitar(event.target.value)}
              aria-invalid={invalido ? "true" : undefined}
              aria-describedby="branch-descricao"
              aria-autocomplete="none"
            />
          </div>
          <div className="branch-bloco acao">
            <span className="branch-rotulo" aria-hidden="true">Avaliar</span>
            <button type="button" className="branch-avaliar" onClick={aoAvaliar}>
              <Search size={14} aria-hidden /> Avaliar
            </button>
          </div>
        </div>
        <p id="branch-descricao" className={`branch-descricao${invalido ? " alerta" : ""}`}>
          {invalido && <TriangleAlert size={13} aria-hidden className="branch-descricao-icone" />}
          {descricao}
        </p>
      </form>

      <div className="branch-colunas">
        <section className="branch-previa" aria-label="Prévia normalizada">
          <h2 className="branch-subtitulo">Prévia normalizada</h2>
          <div className={`branch-codigo ${diagnostico.tipo}`}>{diagnostico.completo || "aguardando o nome…"}</div>
          <dl className="branch-composicao">
            <div className="branch-comp">
              <dt>entrada</dt>
              <dd className="branch-comp-valor">{`${prefixo}/${nome || "—"}`}</dd>
            </div>
            <div className="branch-comp">
              <dt>regras</dt>
              <dd className="branch-comp-valor">minúsculas · sem acentos · espaços → hífens</dd>
            </div>
            <div className="branch-comp">
              <dt>saída</dt>
              <dd className="branch-comp-valor">{diagnostico.completo || "—"}</dd>
            </div>
          </dl>
        </section>

        <section className={`branch-diagnostico${invalido ? " alerta" : ""}`} aria-label="Diagnóstico de nomes">
          <h2 className="branch-subtitulo">Diagnóstico</h2>
          <ul className="branch-veredictos">
            <li className={NOME_RESERVADOS.includes(diagnostico.slug) ? "falha" : "passou"}>
              {NOME_RESERVADOS.includes(diagnostico.slug) ? <Lock size={14} aria-hidden /> : <Check size={14} aria-hidden />}
              <span>
                {NOME_RESERVADOS.includes(diagnostico.slug)
                  ? `«${diagnostico.slug}» é um nome reservado (ramos padrão).`
                  : "Não usa nome reservado do repositório."}
              </span>
            </li>
            <li className={diagnostico.tipo === "colisao" ? "falha" : "passou"}>
              {diagnostico.tipo === "colisao" ? <TriangleAlert size={14} aria-hidden /> : <Check size={14} aria-hidden />}
              <span>
                {diagnostico.tipo === "colisao"
                  ? `${diagnostico.completo} colide: existe localmente desde ${diagnostico.ramo?.data} (${diagnostico.ramo?.autor}).`
                  : `Nenhuma colisão entre os ${RAMOS_LOCAIS.length} ramos locais.`}
              </span>
            </li>
            <li className={diagnostico.tipo === "vazio" ? "neutro" : invalido ? "falha" : "passou"}>
              {diagnostico.tipo === "vazio" ? <GitFork size={14} aria-hidden /> : invalido ? <TriangleAlert size={14} aria-hidden /> : <Check size={14} aria-hidden />}
              <span>
                {diagnostico.tipo === "vazio"
                  ? "Escreva o nome para concluir a avaliação."
                  : invalido
                    ? diagnostico.tipo === "reservado"
                      ? "Use um nome que descreba a mudança."
                      : "Ajuste o nome, ou aplique a correção abaixo."
                    : `${diagnostico.completo} está pronto para usar neste sandbox.`}
              </span>
            </li>
          </ul>
          <div className="branch-acoes">
            {diagnostico.tipo === "colisao" && diagnostico.sugestao && (
              <button type="button" className="branch-botoes principal" onClick={corrigir}>
                <Wrench size={14} aria-hidden /> Corrigir para {diagnostico.sugestao}
              </button>
            )}
            <button type="button" className="branch-botoes" onClick={desfazer} disabled={pilha.length === 0}>
              <RotateCcw size={14} aria-hidden /> Desfazer {pilha.length > 0 ? `(${pilha.length})` : ""}
            </button>
          </div>
        </section>
      </div>

      <div className="branch-rodape">
        <p className="branch-status" id="branch-status" role="status" tabIndex={-1} ref={statusRef}>{msg}</p>
        <button type="button" className="branch-botoes" onClick={reiniciar}>
          <RotateCcw size={14} aria-hidden /> Começar de novo
        </button>
      </div>

      {lotes.length > 0 && (
        <section className="branch-historico" aria-label="Histórico de avaliações">
          <h2 className="branch-subtitulo">Histórico desta sessão</h2>
          <ol className="branch-historico-lista">
            {lotes.map(item => (
              <li key={item.id} className={item.estado}>
                <span className="branch-hora mono">{item.hora}</span>
                <span className="branch-historico-ident mono">{item.slug}</span>
                <span className="branch-pilula">{item.estado}</span>
              </li>
            ))}
          </ol>
          <p className="branch-historico-nota">Reiniciar limpa este histórico e restaura a entrada inicial, inclusive o prefixo selecionado.</p>
        </section>
      )}

      <section className="branch-mapas" aria-label="Ramos locais deste sandbox">
        <h2 className="branch-subtitulo">Ramos locais guardados neste sandbox</h2>
        <ul className="branch-ramos">
          {RAMOS_LOCAIS.map(item => (
            <li key={item.nome} className={`${item.nome.startsWith("main") ? "padrao" : "local"}${diagnostico.tipo === "colisao" && diagnostico.completo === item.nome ? " em-colisao" : ""}`}>
              <span className="branch-ramo-nome mono">{item.nome}</span>
              <span className="branch-ramo-meta">{item.autor} · {item.data}</span>
              {diagnostico.tipo === "colisao" && diagnostico.completo === item.nome && <span className="branch-pilula">colisão</span>}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
