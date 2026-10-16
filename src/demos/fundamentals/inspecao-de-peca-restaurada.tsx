import { useState } from 'react';

// Dados da peça restaurada
const vaseData = {
  id: 'VASO-001',
  name: 'Vaso Cerâmico do Período Romano',
  originalImage: '/images/vase-original.svg',
  restoredImage: '/images/vase-restored.svg',
  repairs: [
    { id: 'REP-001', description: 'Restauração da base com argila e resina', location: 'Base', year: 2018 },
    { id: 'REP-002', description: 'Conserto de fissura lateral com adesivo arqueológico', location: 'Lado esquerdo', year: 2020 },
    { id: 'REP-003', description: 'Reintegração de fragmento superior com massa compatível', location: 'Topo', year: 2022 }
  ]
};

export default function InspecaoDePecaRestaurada() {
  const [showRestored, setShowRestored] = useState(false);
  const [selectedRepairs, setSelectedRepairs] = useState<string[]>([]);

  const toggleView = () => {
    setShowRestored(!showRestored);
  };

  const toggleRepair = (repairId: string) => {
    setSelectedRepairs(prev => 
      prev.includes(repairId) 
        ? prev.filter(id => id !== repairId)
        : [...prev, repairId]
    );
  };

  const hasSelectedRepairs = selectedRepairs.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:gap-12">
              {/* Imagem principal */}
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={showRestored ? vaseData.restoredImage : vaseData.originalImage}
                    alt={showRestored ? 'Vaso restaurado' : 'Vaso original'}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                  {hasSelectedRepairs && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                      <div className="bg-white bg-opacity-90 p-4 rounded-lg text-center">
                        <p className="text-sm font-medium text-gray-800 mb-2">Intervenções selecionadas:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          {selectedRepairs.map(repairId => {
                            const repair = vaseData.repairs.find(r => r.id === repairId);
                            return repair ? <li key={repairId}>{repair.location}</li> : null;
                          })}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={toggleView}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${showRestored ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    {showRestored ? 'Ver Original' : 'Ver Restaurado'}
                  </button>
                  <button
                    onClick={() => setSelectedRepairs([])}
                    disabled={!hasSelectedRepairs}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${hasSelectedRepairs ? 'bg-gray-800 text-white hover:bg-gray-900' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    Limpar seleção
                  </button>
                </div>
              </div>

              {/* Informações e legendas */}
              <div className="lg:w-1/2">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{vaseData.name}</h1>
                  <p className="text-gray-600 mb-4">ID: {vaseData.id}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">Vaso cerâmico datado do período romano, com três intervenções de restauração documentadas.</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Intervenções de Restauração</h2>
                  <div className="space-y-3">
                    {vaseData.repairs.map(repair => (
                      <div key={repair.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id={`repair-${repair.id}`}
                            checked={selectedRepairs.includes(repair.id)}
                            onChange={() => toggleRepair(repair.id)}
                            className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <label htmlFor={`repair-${repair.id}`} className="font-medium text-gray-800 cursor-pointer">
                              {repair.location}
                            </label>
                            <p className="text-sm text-gray-600 mt-1">{repair.description}</p>
                            <p className="text-xs text-gray-500 mt-1">Ano: {repair.year}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Legenda das intervenções</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {hasSelectedRepairs ? (
                      <span>As áreas selecionadas são destacadas na imagem. Cada intervenção é identificada por sua localização no vaso.</span>
                    ) : (
                      <span>Selecione uma ou mais intervenções para visualizar sua localização na imagem.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
