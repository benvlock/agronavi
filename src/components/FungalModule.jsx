import React, { useState } from 'react';
import { PlusCircle, Trash2, PieChart, Info, Microscope, FlaskConical } from 'lucide-react';

export default function FungalModule({ records, setRecords }) {
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sampleName, setSampleName] = useState('');
  const [totalCuts, setTotalCuts] = useState('');
  const [micoCuts, setMicoCuts] = useState('');
  const [trichoCuts, setTrichoCuts] = useState('');
  const [notes, setNotes] = useState('');

  // Real-time calculation previews
  const numTotal = Number(totalCuts) || 0;
  const numMico = Number(micoCuts) || 0;
  const numTricho = Number(trichoCuts) || 0;

  const currentMicoPct = numTotal > 0 ? ((numMico / numTotal) * 100).toFixed(1) : '0.0';
  const currentTrichoPct = numTotal > 0 ? ((numTricho / numTotal) * 100).toFixed(1) : '0.0';

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!numTotal || numTotal <= 0) {
      alert('Ingresa el número total de cortes evaluados (mayor a 0).');
      return;
    }
    if (numMico > numTotal || numTricho > numTotal) {
      alert('Los cortes con presencia fúngica no pueden superar el número total de cortes.');
      return;
    }

    const newRec = {
      id: `f-${Date.now()}`,
      date: date || new Date().toISOString().split('T')[0],
      sampleName: sampleName || `Muestra Raíz #${records.length + 1}`,
      totalCuts: numTotal,
      micoCuts: numMico,
      trichoCuts: numTricho,
      notes: notes || 'Evaluación estereomicroscópica'
    };

    setRecords([newRec, ...records]);

    // Reset fields
    setSampleName('');
    setTotalCuts('');
    setMicoCuts('');
    setTrichoCuts('');
    setNotes('');
  };

  const handleDelete = (id) => {
    setRecords(records.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Live Calculator Window */}
      <div className="navi-window">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-yellow-300 flex items-center gap-1.5">
            <Microscope className="w-3.5 h-3.5 text-green-400" /> FUNGAL_COLONIZATION_ANALYZER.EXE
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2 border-b border-purple-800 pb-2">
            <PieChart className="w-5 h-5 text-green-400" /> CÁLCULO Y REGISTRO DE COLONIZACIÓN FÚNGICA
          </h2>

          <form onSubmit={handleAddRecord} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label>Fecha de Evaluación</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label>Identificador Muestra / Raíz</label>
                <input 
                  type="text" 
                  placeholder="Ej. Raíz Lote 1 - Repetición A"
                  value={sampleName}
                  onChange={(e) => setSampleName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-yellow-400 font-bold">Número Total de Cortes Evaluados (N) *</label>
                <input 
                  type="number" 
                  min="1"
                  placeholder="Ej. 50 cortes"
                  value={totalCuts}
                  onChange={(e) => setTotalCuts(e.target.value)}
                  className="w-full font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-purple-300 font-bold">Cortes con Micorrizas (nmico) *</label>
                <input 
                  type="number" 
                  min="0"
                  max={totalCuts || undefined}
                  placeholder="Ej. 35 con micorrizas"
                  value={micoCuts}
                  onChange={(e) => setMicoCuts(e.target.value)}
                  className="w-full font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-green-400 font-bold">Cortes con Trichoderma (ntricho) *</label>
                <input 
                  type="number" 
                  min="0"
                  max={totalCuts || undefined}
                  placeholder="Ej. 20 con Trichoderma"
                  value={trichoCuts}
                  onChange={(e) => setTrichoCuts(e.target.value)}
                  className="w-full font-bold"
                  required
                />
              </div>

              <div>
                <label>Observaciones Microscópicas</label>
                <input 
                  type="text" 
                  placeholder="Ej. Hifas septadas y arbúsculos visibles"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Live Progress Gauges */}
            {numTotal > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-purple-950/70 border border-purple-700 rounded">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-purple-300 font-bold">% COLONIZACIÓN MICORRÍZICA (VAM)</span>
                    <span className="text-purple-300 font-bold">{currentMicoPct}%</span>
                  </div>
                  <div className="w-full bg-purple-900 h-4 rounded border border-purple-500 overflow-hidden">
                    <div 
                      className="bg-purple-500 h-full transition-all duration-300" 
                      style={{ width: `${Math.min(currentMicoPct, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-green-400 font-bold">% PRESENCIA TRICHODERMA SPP.</span>
                    <span className="text-green-400 font-bold">{currentTrichoPct}%</span>
                  </div>
                  <div className="w-full bg-purple-900 h-4 rounded border border-green-500 overflow-hidden">
                    <div 
                      className="bg-green-400 h-full transition-all duration-300" 
                      style={{ width: `${Math.min(currentTrichoPct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="btn-navi btn-navi-green w-full justify-center">
              <PlusCircle className="w-4 h-4" /> REGISTRAR DATOS DE COLONIZACIÓN
            </button>
          </form>
        </div>
      </div>

      {/* Formula Explanation Window */}
      <div className="navi-window">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-purple-300 flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5 text-yellow-400" /> FORMULAS_MATH_SPEC.DOC
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
          </div>
        </div>

        <div className="p-4 text-xs text-purple-200 border-l-4 border-yellow-400 flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-yellow-400 block mb-1">FÓRMULAS AGRONÓMICAS EMPLEADAS</span>
            <p>
              • <strong>% Colonización Micorrizas:</strong> (Número de cortes con vesículas/arbúsculos ÷ Total de cortes) × 100
            </p>
            <p>
              • <strong>% Presencia Trichoderma:</strong> (Número de cortes con micelio/conidias de Trichoderma ÷ Total de cortes) × 100
            </p>
          </div>
        </div>
      </div>

      {/* History Table Window */}
      <div className="navi-window">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-green-400 flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5 text-yellow-400" /> FUNGAL_EVALUATIONS_HISTORY.GRID
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-md font-bold text-yellow-400 mb-4">
            HISTORIAL DE EVALUACIONES DE MICORRIZAS Y TRICHODERMA ({records.length})
          </h3>

          <div className="overflow-x-auto border border-purple-800">
            <table className="grid-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Muestra / Lote</th>
                  <th>Cortes Totales (N)</th>
                  <th>Cortes Micorrizas</th>
                  <th>% Micorrizas</th>
                  <th>Cortes Trichoderma</th>
                  <th>% Trichoderma</th>
                  <th>Notas</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map((r) => {
                    const mPct = ((r.micoCuts / r.totalCuts) * 100).toFixed(1);
                    const tPct = ((r.trichoCuts / r.totalCuts) * 100).toFixed(1);

                    return (
                      <tr key={r.id}>
                        <td className="text-xs font-mono text-purple-300">{r.date}</td>
                        <td className="font-bold text-yellow-300">{r.sampleName}</td>
                        <td className="text-cyan-400 font-bold">{r.totalCuts} cortes</td>
                        <td>{r.micoCuts}</td>
                        <td className="font-bold text-purple-300">{mPct}%</td>
                        <td>{r.trichoCuts}</td>
                        <td className="font-bold text-green-400">{tPct}%</td>
                        <td className="text-xs text-gray-300 max-w-xs truncate">{r.notes}</td>
                        <td>
                          <button 
                            onClick={() => handleDelete(r.id)} 
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-purple-300 font-mono">
                      No hay evaluaciones fúngicas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
