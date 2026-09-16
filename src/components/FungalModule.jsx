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
    <div className="horizontal-desktop-track window-slide-right">
      {/* WINDOW 1 (Left): Formulario de Evaluación Fúngica */}
      <div className="navi-window w-96 shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-yellow-300 flex items-center gap-1.5">
            <Microscope className="w-3.5 h-3.5 text-green-400" /> FUNGAL_ANALYZER.EXE
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2 border-b border-purple-800 pb-2">
            <PieChart className="w-5 h-5 text-green-400" /> EVALUACIÓN DE CORTES RADICULARES
          </h2>

          <form onSubmit={handleAddRecord} className="space-y-3.5 text-sm">
            <div>
              <label>Fecha de Evaluación</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs"
                required
              />
            </div>

            <div>
              <label>Identificador Muestra / Raíz</label>
              <input 
                type="text" 
                placeholder="Ej. Raíz Lote 1 - Rep. A"
                value={sampleName}
                onChange={(e) => setSampleName(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="text-yellow-400 font-bold">Total Cortes Evaluados (N) *</label>
              <input 
                type="number" 
                min="1"
                placeholder="Ej. 50 cortes"
                value={totalCuts}
                onChange={(e) => setTotalCuts(e.target.value)}
                className="w-full font-bold text-xs"
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
                className="w-full font-bold text-xs"
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
                className="w-full font-bold text-xs"
                required
              />
            </div>

            <button type="submit" className="btn-navi btn-navi-green w-full justify-center h-[40px] mt-2">
              <PlusCircle className="w-4 h-4" /> REGISTRAR DATO FÚNGICO
            </button>
          </form>
        </div>
      </div>

      {/* WINDOW 2 (Middle): Gauges y Fórmulas */}
      <div className="navi-window w-80 shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-purple-300 flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5 text-yellow-400" /> MATH_SPECIFICATIONS.DOC
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {numTotal > 0 ? (
            <div className="space-y-4 p-3 bg-purple-950/70 border border-purple-700 rounded">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-purple-300 font-bold">% MICORRIZAS (VAM)</span>
                  <span className="text-purple-300 font-bold">{currentMicoPct}%</span>
                </div>
                <div className="w-full bg-purple-900 h-3.5 rounded border border-purple-500 overflow-hidden">
                  <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${Math.min(currentMicoPct, 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-green-400 font-bold">% TRICHODERMA SPP.</span>
                  <span className="text-green-400 font-bold">{currentTrichoPct}%</span>
                </div>
                <div className="w-full bg-purple-900 h-3.5 rounded border border-green-500 overflow-hidden">
                  <div className="bg-green-400 h-full transition-all duration-300" style={{ width: `${Math.min(currentTrichoPct, 100)}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-purple-950/50 border border-purple-800 rounded text-center text-xs text-purple-300 font-mono">
              Ingresa cortes evaluados para calcular los porcentajes en tiempo real.
            </div>
          )}

          <div className="text-xs text-purple-200 border-l-4 border-yellow-400 p-3 bg-purple-950/40 rounded space-y-1">
            <span className="font-bold text-yellow-400 block mb-1">FÓRMULAS EMPLEADAS</span>
            <p>• <strong>% Micorrizas:</strong> (Cortes Micorrizas ÷ Cortes Totales) × 100</p>
            <p>• <strong>% Trichoderma:</strong> (Cortes Trichoderma ÷ Cortes Totales) × 100</p>
          </div>
        </div>
      </div>

      {/* WINDOW 3 (Right): Historial de Evaluaciones Fúngicas */}
      <div className="navi-window w-[520px] shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-green-400 flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5 text-yellow-400" /> FUNGAL_EVALUATIONS_MATRIX.GRID
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-xs font-bold text-yellow-400 mb-3">
            HISTORIAL DE COLONIZACIÓN ({records.length})
          </h3>

          <div className="overflow-x-auto border border-purple-800 h-[280px]">
            <table className="grid-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Muestra</th>
                  <th>Cortes (N)</th>
                  <th>% Micorrizas</th>
                  <th>% Trichoderma</th>
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
                        <td className="font-bold text-yellow-300 text-xs">{r.sampleName}</td>
                        <td className="text-cyan-400 font-bold text-xs">{r.totalCuts}</td>
                        <td className="font-bold text-purple-300 text-xs">{mPct}%</td>
                        <td className="font-bold text-green-400 text-xs">{tPct}%</td>
                        <td>
                          <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-300 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-purple-300 font-mono text-xs">
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
