import React, { useState, useMemo } from 'react';

type Mood = 'ambiente' | 'pulsante' | 'denso' | 'solto';
type SortMode = 'ordem' | 'duracao' | 'nome';

interface Section {
  label: string;
  seconds: number;
}

interface Track {
  id: string;
  name: string;
  artist: string;
  mood: Mood;
  // null = duração não registrada (ausência de dados, diferente de zero)
  seconds: number | null;
  sections: Section[] | null;
  ineligibleReason: string | null;
}

// Dados locais — artistas e faixas fictícios, IDs estáveis.
const TRACKS: Track[] = [
  {
    id: 'trk-001', name: 'Primeira Luz', artist: 'Rio Acústico', mood: 'ambiente', seconds: 120,
    sections: [
      { label: 'Intro', seconds: 20 }, { label: 'Tema', seconds: 50 },
      { label: 'Variação', seconds: 30 }, { label: 'Final', seconds: 20 },
    ],
    ineligibleReason: null,
  },
  {
    id: 'trk-002', name: 'Maré Alta', artist: 'Rio Acústico', mood: 'pulsante', seconds: 180,
    sections: [
      { label: 'Intro', seconds: 30 }, { label: 'Camada', seconds: 60 },
      { label: 'Clímax', seconds: 60 }, { label: 'Saída', seconds: 30 },
    ],
    ineligibleReason: null,
  },
  {
    id: 'trk-003', name: 'Respiro', artist: 'Coruja de Papel', mood: 'ambiente', seconds: 60,
    sections: [{ label: 'Tema', seconds: 40 }, { label: 'Final', seconds: 20 }],
    ineligibleReason: null,
  },
  {
    id: 'trk-004', name: 'Stinger do Portão', artist: 'Coruja de Papel', mood: 'pulsante', seconds: 30,
    sections: [{ label: 'Impacto', seconds: 10 }, { label: 'Resíduo', seconds: 20 }],
    ineligibleReason: null,
  },
  {
    id: 'trk-005', name: 'Travessia Longa', artist: 'Ferro e Musgo', mood: 'denso', seconds: 240,
    sections: [
      { label: 'Intro', seconds: 40 }, { label: 'Tema', seconds: 80 },
      { label: 'Clímax', seconds: 80 }, { label: 'Final', seconds: 40 },
    ],
    ineligibleReason: null,
  },
  {
    id: 'trk-006', name: 'Tema Improvisado', artist: 'Ferro e Musgo', mood: 'solto', seconds: null,
    sections: null, ineligibleReason: null,
  },
  {
    id: 'trk-007', name: 'Gravação ao Vivo 07', artist: 'Rio Acústico', mood: 'denso', seconds: 150,
    sections: null,
    ineligibleReason: 'Gravação ao vivo não pode compor trilha montada por estrutura de duração.',
  },
];

// Caso de referência: 120 s + 180 s + 60 s = 6 min.
const INITIAL_SELECTION = ['trk-001', 'trk-002', 'trk-003'];
const INITIAL_MOOD: Mood | 'todos' = 'todos';
const INITIAL_SORT: SortMode = 'ordem';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m} min ${String(s).padStart(2, '0')} s` : `${s} s`;
}

function formatTimecode(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function DescobertaDeTrilhaSonora() {
  const [selectedIds, setSelectedIds] = useState<string[]>([...INITIAL_SELECTION]);
  const [moodFilter, setMoodFilter] = useState<Mood | 'todos'>(INITIAL_MOOD);
  const [sortMode, setSortMode] = useState<SortMode>(INITIAL_SORT);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(true);
  const [history, setHistory] = useState<string[][]>([]);
  const [announcement, setAnnouncement] = useState('');

  const trackById = (id: string) => TRACKS.find((t) => t.id === id)!;

  const selectedTracks = useMemo(
    () => selectedIds.map(trackById),
    [selectedIds]
  );

  const sortedSelected = useMemo(() => {
    const list = [...selectedTracks];
    if (sortMode === 'duracao') list.sort((a, b) => (b.seconds ?? -1) - (a.seconds ?? -1));
    if (sortMode === 'nome') list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    return list;
  }, [selectedTracks, sortMode]);

  const totalSeconds = sortedSelected.reduce((acc, t) => acc + (t.seconds ?? 0), 0);
  const uncountedSelected = sortedSelected.filter((t) => t.seconds === null);

  const visibleCatalog = TRACKS.filter((t) => moodFilter === 'todos' || t.mood === moodFilter);

  function commitSelection(next: string[], message: string) {
    setHistory((prev) => [...prev, selectedIds]);
    setSelectedIds(next);
    setAnnouncement(message);
  }

  function toggleTrack(id: string) {
    const track = trackById(id);
    if (selectedIds.includes(id)) {
      commitSelection(selectedIds.filter((x) => x !== id), `Faixa removida: ${track.name}. Total: ${formatDuration(totalSeconds - (track.seconds ?? 0))}.`);
    } else {
      commitSelection([...selectedIds, id], `Faixa adicionada: ${track.name}. Total: ${formatDuration(totalSeconds + (track.seconds ?? 0))}.`);
    }
  }

  function undo() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setSelectedIds(prev);
    setAnnouncement(`Seleção desfeita. Total: ${formatDuration(prev.map(trackById).reduce((a, t) => a + (t.seconds ?? 0), 0))}.`);
  }

  function reset() {
    setSelectedIds([...INITIAL_SELECTION]);
    setMoodFilter(INITIAL_MOOD);
    setSortMode(INITIAL_SORT);
    setExpandedId(null);
    setCatalogOpen(true);
    setHistory([]);
    setAnnouncement('Demonstração reiniciada. Caso de referência restaurado: 6 min 00 s em 3 faixas.');
  }

  // Timecode acumulado na ordem atual (base da linha do tempo proporcional).
  let cursor = 0;
  const timelineRows = sortedSelected.map((t) => {
    const start = cursor;
    cursor += t.seconds ?? 0;
    return { track: t, start };
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Descoberta com informação progressiva</p>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Descoberta de trilha sonora</h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Selecione faixas fictícias e veja a estrutura por duração em uma linha do tempo proporcional,
            com detalhamento por seção — sem reproduzir nenhum áudio.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Região principal: estrutura derivada da seleção */}
          <section aria-labelledby="estrutura-titulo" className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="estrutura-titulo" className="text-lg font-semibold">Estrutura da trilha</h2>
                <p className="text-sm text-slate-500">
                  {selectedTracks.length === 0
                    ? 'Nenhuma faixa selecionada'
                    : `${selectedTracks.length} ${selectedTracks.length === 1 ? 'faixa' : 'faixas'} · total ${formatDuration(totalSeconds)}`}
                </p>
              </div>

              {selectedTracks.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  Escolha faixas no catálogo para montar a trilha. Uma faixa sem duração registrada não entra no total.
                </p>
              ) : (
                <>
                  {/* Barra proporcional (visual); a lista abaixo é a representação acessível */}
                  <div aria-hidden="true" className="mt-4 flex h-16 w-full overflow-hidden rounded-lg border border-slate-200">
                    {timelineRows.filter((r) => r.track.seconds !== null).map((r) => (
                      <div
                        key={r.track.id}
                        className="flex h-full items-center justify-center overflow-hidden border-r border-white/70 text-[10px] font-semibold text-white last:border-r-0"
                        style={{ width: `${(r.track.seconds! / totalSeconds) * 100}%` }}
                      >
                        <span className="truncate px-1">{formatTimecode(r.start)}</span>
                      </div>
                    ))}
                  </div>
                  {uncountedSelected.length > 0 && (
                    <p className="mt-2 text-xs text-amber-800">
                      ⊘ {uncountedSelected.map((t) => t.name).join(', ')}: sem duração registrada — visível na lista, fora do total.
                    </p>
                  )}

                  <ol className="mt-4 space-y-2">
                    {timelineRows.map(({ track, start }) => (
                      <li key={track.id} className="rounded-lg border border-slate-200 bg-white">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 p-3">
                          <span className="font-mono text-xs text-slate-500">
                            {track.seconds === null ? '—' : `${formatTimecode(start)}–${formatTimecode(start + track.seconds)}`}
                          </span>
                          <span className="font-medium">{track.name}</span>
                          <span className="text-xs text-slate-500">{track.artist}</span>
                          <span className="text-xs text-slate-500">
                            {track.seconds === null ? 'sem duração registrada' : formatDuration(track.seconds)}
                          </span>
                          {track.sections && (
                            <button
                              type="button"
                              className="ml-auto rounded-md border border-indigo-200 px-2 py-1 text-xs font-semibold text-indigo-800 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              aria-expanded={expandedId === track.id}
                              aria-controls={`estrutura-${track.id}`}
                              aria-label={`${expandedId === track.id ? 'Recolher' : 'Ver'} estrutura de ${track.name}`}
                              onClick={() => setExpandedId(expandedId === track.id ? null : track.id)}
                            >
                              {expandedId === track.id ? 'Recolher estrutura' : 'Ver estrutura'}
                            </button>
                          )}
                        </div>
                        {track.sections && expandedId === track.id && (
                          <ul id={`estrutura-${track.id}`} className="border-t border-slate-100 p-3 text-sm">
                            {track.sections.map((sec) => (
                              <li key={sec.label} className="flex items-center gap-2 py-0.5">
                                <span className="h-2 rounded-sm bg-indigo-500" style={{ width: `${Math.max(8, (sec.seconds / track.sections!.reduce((a, s) => a + s.seconds, 0)) * 160)}px` }} aria-hidden="true" />
                                <span>{sec.label}</span>
                                <span className="text-xs text-slate-500">{formatDuration(sec.seconds)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ol>
                </>
              )}

              <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm font-medium text-indigo-800">{announcement}</p>
            </div>
          </section>

          {/* Catalogo secundario com filtro e ordenação (seleção preservada por ID) */}
          <section aria-labelledby="catalogo-titulo" className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h2 id="catalogo-titulo" className="text-lg font-semibold">Catálogo local</h2>
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  aria-expanded={catalogOpen}
                  aria-controls="lista-catalogo"
                  onClick={() => setCatalogOpen(!catalogOpen)}
                >
                  {catalogOpen ? 'Ocultar catálogo' : 'Mostrar catálogo'}
                </button>
              </div>

              {catalogOpen && (
                <>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <div className="space-y-1">
                      <label htmlFor="filtro-mood" className="block text-xs font-semibold text-slate-600">Filtrar por clima</label>
                      <select
                        id="filtro-mood"
                        value={moodFilter}
                        onChange={(e) => setMoodFilter(e.target.value as Mood | 'todos')}
                        className="rounded-md border border-slate-300 px-2 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <option value="todos">Todos</option>
                        <option value="ambiente">Ambiente</option>
                        <option value="pulsante">Pulsante</option>
                        <option value="denso">Denso</option>
                        <option value="solto">Solto</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="ordenacao" className="block text-xs font-semibold text-slate-600">Ordenar por</label>
                      <select
                        id="ordenacao"
                        value={sortMode}
                        onChange={(e) => setSortMode(e.target.value as SortMode)}
                        className="rounded-md border border-slate-300 px-2 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <option value="ordem">Ordem de seleção</option>
                        <option value="duracao">Maior duração</option>
                        <option value="nome">Nome</option>
                      </select>
                    </div>
                  </div>

                  <ul id="lista-catalogo" className="mt-4 space-y-2">
                    {visibleCatalog.map((track) => {
                      const checked = selectedIds.includes(track.id);
                      const disabled = track.ineligibleReason !== null;
                      return (
                        <li key={track.id} className={`rounded-lg border p-3 ${disabled ? 'border-dashed border-slate-300 bg-slate-50' : 'border-slate-200'}`}>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`sel-${track.id}`}
                              checked={checked}
                              disabled={disabled}
                              onChange={() => toggleTrack(track.id)}
                              className="h-4 w-4 accent-indigo-700"
                            />
                            <label htmlFor={`sel-${track.id}`} className="cursor-pointer text-sm font-medium">
                              {track.name} <span className="font-normal text-slate-500">— {track.artist}</span>
                            </label>
                            <span className="ml-auto text-xs text-slate-500">
                              {track.seconds === null ? 'sem duração' : formatDuration(track.seconds)}
                            </span>
                          </div>
                          {disabled && <p className="mt-1 pl-6 text-xs text-slate-600">⊘ {track.ineligibleReason}</p>}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={undo}
                  disabled={history.length === 0}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Desfazer última alteração
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-md border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-900 hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Reiniciar demonstração
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}