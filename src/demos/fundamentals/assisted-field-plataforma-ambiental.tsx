"use client";

import { useState, type FormEvent } from "react";
import { Droplet, Gauge, Leaf, Recycle, Sprout } from "lucide-react";

/*
 * Dados fictícios e locais: as iniciativas acompanhadas pela
 * plataforma (sem nenhum serviço externo), com unidade, meta anual,
 * breve descrição e dica de preenchimento.
 */
const INICIATIVAS = [
  {
    id: "aguas",
    nome: "Águas Reutilizadas",
    unidade: "litros",
    Icone: Droplet,
    metaAnual: 1200000,
    descricao: "Água recuperada e reciclada nas áreas verdes comunitárias",
    dica: "Lembrete: registro mensal, valores em litros",
  },
  {
    id: "floresta",
    nome: "Recuperação Florestal",
    unidade: "árvores",
    Icone: Sprout,
    metaAnual: 32000,
    descricao: "Mudas plantadas nos corredores ecológicos restaurados",
    dica: "Lembrete: soma acumulativa, contagem em árvores",
  },
  {
    id: "energia",
    nome: "Eficiência Energética",
    unidade: "MWh",
    Icone: Gauge,
    metaAnual: 540,
    descricao: "Economia obtida pela rede fotovoltaica compartilhada",
    dica: "Lembrete: energia economizada, em MWh",
  },
  {
    id: "residuos",
    nome: "Resíduos Orgânicos",
    unidade: "toneladas",
    Icone: Recycle,
    metaAnual: 340,
    descricao: "Biodigestão dos resíduos orgânicos tratados",
    dica: "Lembrete: aceita decimais, valores em toneladas",
  },
];

const formatarNumero = (valor: number) =>
  valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

function invalidoTexto(valor: string, inicia: { metaAnual: number; unidade: string }): string {
  const numero = Number(valor.trim().replace(",", "."));
  if (Number.isNaN(numero) || valor.trim() === "")
    return "Digite um número válido — apenas dígitos, vírgula ou ponto.";
  if (numero <= 0) return "Use um valor maior que zero.";
  if (numero > inicia.metaAnual)
    return `Valor acima da meta anual (${formatarNumero(inicia.metaAnual)} ${inicia.unidade}).`;
  return "Valor fora da faixa esperada.";
}

function gerarCodigoReferencia(iniciaticaId: string, valorNumerico: number) {
  let hash = 0;
  const seed = `${iniciaticaId}|${valorNumerico}`;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const parteNum = 1000 + (hash % 9000);
  return `${iniciaticaId.slice(0, 3).toUpperCase()}-${parteNum}`;
}

interface EstadoForm {
  initiativeId: string;
  valueRaw: string;
  observation: string;
  fase: "idle" | "loading" | "success";
  refCode: string;
}

export default function AssistedFieldPlataformaAmbiental() {
  const [form, setForm] = useState<EstadoForm>({
    initiativeId: "",
    valueRaw: "",
    observation: "",
    fase: "idle",
    refCode: "",
  });

  const init = INICIATIVAS.find((i) => i.id === form.initiativeId) ?? null;
  const bruto = form.valueRaw.trim().replace(",", ".");
  const numerico = Number(bruto);
  const textoValido = (numero: number) =>
    numero > 0 && numero <= (init?.metaAnual ?? Number.MAX_SAFE_INTEGER);
  const valid = Boolean(init) && form.valueRaw.trim() !== "" && !Number.isNaN(numerico) && textoValido(numerico);
  const percentual = init && valid ? Math.min(100, Math.round((numerico / init.metaAnual) * 100)) : 0;
  const progressoTexto = !init
    ? "Selecione uma iniciativa para acompanhar a leitura."
    : !form.valueRaw.trim()
      ? init.dica
      : !valid
        ? invalidoTexto(form.valueRaw, init)
        : `Registrado ${formatarNumero(numerico)} de ${formatarNumero(init.metaAnual)} ${init.unidade} — ${percentual}% da meta anual.`;
  function atualizar<K extends keyof EstadoForm>(chave: K, val: EstadoForm[K]) {
    setForm((prev) => ({ ...prev, [chave]: val }));
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.fase === "success") {
      setForm((prev) => ({ ...prev, valueRaw: "", fase: "idle", refCode: "" }));
      return;
    }
    if (form.fase === "loading" || !valid) return;
    const codigo = gerarCodigoReferencia(form.initiativeId, numerico);
    setForm((prev) => ({ ...prev, fase: "loading", refCode: codigo }));
    window.setTimeout(
      () => {
        setForm((prev) => ({ ...prev, fase: "success" }));
      },
      550,
    );
  }

  return (
    <section className="ambiente-demo" aria-label="Registro de leituras da plataforma ambiental">
      <div className="ambiente-container">
        <header className="ambiente-header">
          <span className="ambiente-kicker">Fundamentos · Demonstração</span>
          <span className="ambiente-badge">
            <Leaf size={13} aria-hidden="true" />
            Plataforma Ambiental
          </span>
        </header>
        <div className="ambiente-hero">
          <h1>
            Indicadores vivos, decisões <em>sustentadas</em>
          </h1>
          <p>
            Registre uma leitura de uma iniciativa de sustentabilidade, valide o
            formato e confira sua posição contra a meta anual.
          </p>
        </div>
        <form className="ambiente-form" onSubmit={submit} noValidate>
          <div className="ambiente-field">
            <label className="ambiente-label" htmlFor="ambiente-initi">
              <Leaf size={13} aria-hidden="true" /> Iniciativa acompanhada
            </label>
            <select
              id="ambiente-initi"
              className="ambiente-select"
              value={form.initiativeId}
              onChange={(ev) => atualizar("initiativeId", ev.target.value)}
              disabled={form.fase === "loading" || form.fase === "success"}
            >
              <option value="">Escolha qual indicador registrar…</option>
              {INICIATIVAS.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome} — {i.unidade}
                </option>
              ))}
            </select>
            <span className="ambiente-hin" role="note">
              {init ? `${init.descricao}. ${init.dica}` : 
"Dicas ficam aqui conforme você preenche cada iniciativa."}
            </span>
          </div>
          {init && (
            <div className="ambiente-field">
              <label className="ambiente-label" htmlFor="ambiente-valor">
                Valor acumulado da iniciativa
                <small>
                  Meta anual: {formatarNumero(init.metaAnual)} {init.unidade}
                </small>
              </label>
              <div
                className={`ambiente-input-wrap ${
                  valid ? "is-ok" : form.valueRaw.trim() === "" ? "" : "is-bad"
                }`}
              >
                <input
                  className="ambiente-numb"
                  value={form.valueRaw}
                  onBlur={() => undefined}
                  onFocus={() => undefined}
                  onChange={(ev) => atualizar("valueRaw", ev.target.value)}
                  placeholder={`Digite um número em ${init.unidade}`}
                  disabled={form.fase === "loading" || form.fase === "success"}
                  aria-invalid={!valid && form.valueRaw.trim() !== "" ? "true" : undefined}
                  type="number"
                  min={0}
                  step={1}
                />
              </div>
              <span className="ambiente-hin" role="note" aria-live="polite">
                {progressoTexto}
              </span>
              {valid && (
                <div className="ambiente-progresso" role="img" aria-label={`${percentual}% da meta anual`}>
                  <div
                    className="ambiente-progresso-fill"
                    style={{ width: `${percentual}%` }}
                  />
                </div>
              )}
            </div>
          )}
          <button
            type="submit"
            className="ambiente-btn"
            disabled={
              !valid || form.fase === "loading" || form.fase === "success"
            }
          >
            {form.fase === "success" ? "Confirmado — nova leitura?" : "Guardar leitura"}
          </button>
          {form.fase === "loading" && (
            <span className="ambiente-ok" role="status">Validando e confirmando…</span>
          )}
          {form.fase === "success" && form.refCode && (
            <span className="ambiente-ok" role="status">
              Registro local <strong>{form.refCode}</strong> gerado sem enviar nada a serviço.
            </span>
          )}
          <footer className="ambiente-rodape" role="note">
            <Recycle size={12} aria-hidden="true" /> Todas as leituras e códigos de referência
            ficam apenas neste formulário, demonstrando confirmação local para uma equipe
            ambiental.
            <p>
              Sem autenticação, pagamentos ou serviços reais — o botão mostra validação,
              carregamento breve e mensagem de sucesso.
            </p>
          </footer>
        </form>
      </div>
    </section>
  );
}
