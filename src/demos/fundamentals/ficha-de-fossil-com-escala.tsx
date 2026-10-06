import React, { useState, useMemo } from 'react';

interface Tool {
  id: string;
  name: string;
  lengthCm: number;
  color: string;
}

interface Fossil {
  id: string;
  name: string;
  lengthCm: number;
}

const FOSSIL_DATA: Fossil = {
  id: 'fossil-0021',
  name: 'T-Rex Segment',
  lengthCm: 180,
};

const TOOLS: Tool[] = [
  { id: 'ruler-small', name: 'Régua Padrão', lengthCm: 30, color: 'bg-blue-500' },
  { id: 'ruler-medium', name: 'Régua Média', lengthCm: 50, color: 'bg-green-500' },
  { id: 'ruler-large', name: 'Régua Grande', lengthCm: 100, color: 'bg-purple-500' },
];

const FossilScaleDemo = () => {
  const [selectedToolId, setSelectedToolId] = useState<string>('ruler-small');

  const selectedTool = useMemo(
    () => TOOLS.find((t) => t.id === selectedToolId)!,
    [selectedToolId]
  );

  const countNeeded = Math.ceil(FOSSIL_DATA.lengthCm / selectedTool.lengthCm);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 bg-white text-slate-900">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Ficha de Fóssil: {FOSSIL_DATA.name}
        </h1>
        <p className="text-slate-500">
          Estime e visualize a escala de medição necessária para este segmento.
        </p>
      </header>

      {/* Main Section: The Fossil & Scale Visual */}
      <section className="space-y-6">
        <div className="relative space-y-4">
          <div className="flex justify-between text-sm font-medium text-slate-500">
            <span>Início</span>
            <span>{FOSSIL_DATA.lengthCm} cm</span>
          </div>
          
          {/* Fossil Representation Bar */}
          <div className="h-12 w-full bg-slate-100 rounded-full relative overflow-hidden border border-slate-200">
             <div 
                className="absolute inset-0 bg-amber-100 opacity-50" 
                style={{ width: '100%' }}
             />
             <div className="absolute inset-y-0 left-0 bg-amber-500/20 w-full" />
             <div className="absolute inset-y-0 left-0 bg-amber-700/10 w-full" />
          </div>

          {/* Tool Visualizer (The "Scale" aspect) */}
          <div className="flex items-center justify-center gap-1 py-4">
            {[...Array(countNeeded)].map((_, i) => (
              <div
                key={i}
                className={`h-8 ${selectedTool.color} rounded-md transition-all duration-300 shadow-sm flex items-center justify-center text-[10px] text-white font-bold`}
                style={{ width: `${(selectedTool.lengthCm / FOSSIL_DATA.lengthCm) * 100}%` }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <div className="text-center py-2">
            <p className="text-lg font-semibold text-slate-800">
              Necessário: <span className="text-amber-600">{countNeeded}</span> {selectedTool.name}
            </p>
            <p className="text-sm text-slate-500">
              Total cobertura: {countNeeded * selectedTool.lengthCm} cm
            </p>
          </div>
        </div>
      </section>

      {/* Interaction Section: Tool Selection */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Selecione ferramenta de medição</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedToolId(tool.id)}
              className={`
                p-4 rounded-xl border-2 transition-all text-left group
                ${selectedToolId === tool.id 
                  ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20' 
                  : 'border-slate-200 bg-white hover:border-slate-300'}
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-4 h-4 rounded-full ${tool.color}`} />
                <span className="font-bold text-slate-900">{tool.name}</span>
              </div>
              <div className="text-xs font-medium text-slate-500">
                {tool.lengthCm} cm
              </div>
              {selectedToolId === tool.id && (
                <div className="mt-2 text-[10px] text-amber-600 font-bold uppercase">
                  Selecionado
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSelectedToolId('ruler-small')}
          className="w-full py-2 text-sm font-medium text-slate-500 hover:text-slate-900 underline decoration-slate-300 transition-colors"
        >
          Reiniciar medição
        </button>
      </section>

      {/* Footer/Status Message */}
      <footer className="pt-6 border-t border-slate-100 text-center text-[10px] text-slate-400 uppercase tracking-widest">
        Simulação Local • Dados Fictícios
      </footer>
    </div>
  );
};

export default FossilScaleDemo;
