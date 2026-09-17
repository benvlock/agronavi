import React, { useState } from 'react';
import { PlusCircle, Trash2, PieChart, Microscope, FlaskConical } from 'lucide-react';

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
          <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
            <Microscope className="w-3.5 h-3.5 text-emerald-400" /> ANÁLISIS_FÚNGICO_LAB.EXE
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-base font-bold text-gray-100 mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
            <PieChart className="w-4 h-4 text-emerald-400" /> CORTES DE RAÍZ Y COLONIZACIÓN
          </h2>

          <form onSubmit={handleAddRecord} className="space-y-3.5 text-xs">
            <div>
              <label className="text-gray-300 font-medium">Fecha de Evaluación *</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="text-gray-300 font-medium">Identificador Muestra / Raíz</label>
              <input 
                type="text" 
                placeholder="Ej. Raíz Lote 1 - Rep. A"
                value={sampleName}
                onChange={(e) => setSampleName(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="text-gray-200 font-semibold">Total Cortes Evaluados (N) *</label>
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
              <label className="text-sky-400 font-semibold">Cortes con Micorrizas (VAM) *</label>
              <input 
                type="number" 
                min="0"
                max={totalCuts || undefined}
                placeholder="Ej. 35"
                value={micoCuts}
                onChange={(e) => setMicoCuts(e.target.value)}
                className="w-full font-bold text-xs"
                required
              />
            </div>

            <div>
              <label className="text-emerald-400 font-semibold">Cortes con Trichoderma spp. *</label>
              <input 
                type="number" 
                min="0"
                max={totalCuts || undefined}
                placeholder="Ej. 20"
                value={trichoCuts}
                onChange={(e) => setTrichoCuts(e.target.value)}
                className="w-full font-bold text-xs"
                required
              />
            </div>

            <div>
              <label className="text-gray-400">Observaciones Lab</label>
              <input 
                type="text" 
                placeholder="Ej. Tinción azul de tripano limpia"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <button type="submit" className="btn-navi btn-navi-green w-full justify-center h-[38px] mt-2 font-bold">
              <PlusCircle className="w-4 h-4" /> REGISTRAR DATO FÚNGICO
            </button>
          </form>
        </div>
      </div>

      {/* WINDOW 2 (Middle): Gauges y Fórmulas */}
      <div className="navi-window w-80 shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-gray-300 flex items-center gap-1.5 font-semibold">
            <FlaskConical className="w-3.5 h-3.5 text-sky-400" /> CÁLCULO_COLONIZACIÓN.SYS
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {numTotal > 0 ? (
            <div className="space-y-4 p-3 bg-gray-900 border border-gray-800 rounded">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-sky-400 font-bold">% MICORRIZAS (VAM)</span>
                  <span className="text-sky-400 font-bold">{currentMicoPct}%</span>
                </div>
                <div className="w-full bg-gray-800 h-3 rounded overflow-hidden border border-gray-700">
                  <div className="bg-sky-400 h-full transition-all duration-300" style={{ width: `${Math.min(Number(currentMicoPct), 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-emerald-400 font-bold">% TRICHODERMA SPP.</span>
                  <span className="text-emerald-400 font-bold">{currentTrichoPct}%</span>
                </div>
                <div className="w-full bg-gray-800 h-3 rounded overflow-hidden border border-gray-700">
                  <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${Math.min(Number(currentTrichoPct), 100)}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-900 border border-gray-800 rounded text-center text-xs text-gray-400 font-mono">
              Ingresa el número total de cortes evaluados para calcular colonización en tiempo real.
            </div>
          )}

          <div className="text-xs text-gray-300 border-l-2 border-emerald-400 p-3 bg-gray-900 rounded space-y-1">
            <span className="font-bold text-emerald-400 block mb-1">METODOLOGÍA DE CÁLCULO</span>
            <p>• <strong>% Micorrizas:</strong> (Cortes Micorrizas ÷ Cortes Totales) × 100</p>
            <p>• <strong>% Trichoderma:</strong> (Cortes Trichoderma ÷ Cortes Totales) × 100</p>
          </div>
        </div>
      </div>

      {/* WINDOW 3 (Right): Historial de Evaluaciones Fúngicas */}
      <div className="navi-window w-[520px] shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
            <PieChart className="w-3.5 h-3.5 text-emerald-400" /> HISTORIAL_COLONIZACIÓN.GRID
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-xs font-bold text-gray-200 mb-3">
            EVALUACIONES REGISTRADAS ({records.length})
          </h3>

          <div className="overflow-x-auto border border-gray-700 h-[280px] rounded">
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
                        <td className="text-xs font-mono text-gray-400">{r.date}</td>
                        <td className="font-semibold text-gray-200 text-xs">{r.sampleName}</td>
                        <td className="text-sky-300 font-bold text-xs">{r.totalCuts}</td>
                        <td className="font-bold text-sky-400 text-xs">{mPct}%</td>
                        <td className="font-bold text-emerald-400 text-xs">{tPct}%</td>
                        <td>
                          <button onClick={() => handleDelete(r.id)} className="text-rose-400 hover:text-rose-300 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400 font-mono text-xs">
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
