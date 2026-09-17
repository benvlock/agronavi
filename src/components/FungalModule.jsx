import React, { useState } from 'react';
import { PlusCircle, Trash2, PieChart, Microscope, FlaskConical, CheckCircle } from 'lucide-react';

export default function FungalModule({ records, setRecords }) {
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sampleName, setSampleName] = useState('');
  const [totalCuts, setTotalCuts] = useState('');
  const [micoCuts, setMicoCuts] = useState('');
  const [trichoCuts, setTrichoCuts] = useState('');
  const [notes, setNotes] = useState('');

  // Sub-view mode
  const [viewMode, setViewMode] = useState('all'); // 'all' | 'form' | 'table'

  // Real-time calculation previews
  const numTotal = Number(totalCuts) || 0;
  const numMico = Number(micoCuts) || 0;
  const numTricho = Number(trichoCuts) || 0;

  const currentMicoPct = numTotal > 0 ? ((numMico / numTotal) * 100).toFixed(1) : '0.0';
  const currentTrichoPct = numTotal > 0 ? ((numTricho / numTotal) * 100).toFixed(1) : '0.0';

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!numTotal || numTotal <= 0) {
      alert('Por favor ingresa el número total de cortes evaluados (mayor a 0).');
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
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="navi-window p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Microscope className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-gray-100">
              Análisis Fúngico en Laboratorio
            </h2>
            <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono">
              Micorrizas & Trichoderma
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Evaluación estereomicroscópica de porcentaje de colonización radicular.
          </p>
        </div>

        {/* View Mode Toggle Menu */}
        <div className="flex items-center gap-1.5 bg-gray-900 p-1 border border-gray-800 rounded">
          <button 
            onClick={() => setViewMode('all')}
            className={`px-2.5 py-1 text-xs rounded font-semibold transition-all ${
              viewMode === 'all' ? 'bg-emerald-500 text-gray-950 shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Vista Completa
          </button>
          <button 
            onClick={() => setViewMode('form')}
            className={`px-2.5 py-1 text-xs rounded font-semibold transition-all ${
              viewMode === 'form' ? 'bg-emerald-500 text-gray-950 shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Formulario de Registro
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 text-xs rounded font-semibold transition-all ${
              viewMode === 'table' ? 'bg-emerald-500 text-gray-950 shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Historial ({records.length})
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Form & Calculation Gauge */}
        {(viewMode === 'all' || viewMode === 'form') && (
          <div className={`${viewMode === 'all' ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-5`}>
            {/* Input Form */}
            <div className="navi-window p-5 space-y-4">
              <div className="border-b border-gray-800 pb-2">
                <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-400" /> Registro de Cortes Radiculares
                </h3>
              </div>

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
                  <label className="text-gray-300 font-medium">Identificador de Muestra Radicular</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Raíz Lote 1 - Réplica A"
                    value={sampleName}
                    onChange={(e) => setSampleName(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>

                <div>
                  <label className="text-gray-200 font-semibold">Total de Cortes Evaluados (N) *</label>
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

                <div className="grid grid-cols-2 gap-2">
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
                    <label className="text-emerald-400 font-semibold">Cortes con Trichoderma *</label>
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
                </div>

                <div>
                  <label className="text-gray-400">Observaciones de Laboratorio</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Tinción limpia, vesículas visibles"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>

                <button type="submit" className="btn-navi btn-navi-green w-full justify-center h-[38px] mt-1 font-bold">
                  <PlusCircle className="w-4 h-4" /> REGISTRAR EVALUACIÓN FÚNGICA
                </button>
              </form>
            </div>

            {/* Calculations & Gauges */}
            <div className="navi-window p-4 space-y-4">
              <div className="border-b border-gray-800 pb-2">
                <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-sky-400" /> Cálculo en Tiempo Real
                </h3>
              </div>

              {numTotal > 0 ? (
                <div className="space-y-3.5 p-3.5 bg-gray-900 border border-gray-800 rounded">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-sky-400 font-bold">% Colonización Micorrízica</span>
                      <span className="text-sky-400 font-bold">{currentMicoPct}%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-3 rounded overflow-hidden border border-gray-700">
                      <div className="bg-sky-400 h-full transition-all duration-300" style={{ width: `${Math.min(Number(currentMicoPct), 100)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-emerald-400 font-bold">% Presencia Trichoderma spp.</span>
                      <span className="text-emerald-400 font-bold">{currentTrichoPct}%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-3 rounded overflow-hidden border border-gray-700">
                      <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${Math.min(Number(currentTrichoPct), 100)}%` }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-900 border border-gray-800 rounded text-center text-xs text-gray-400 font-mono">
                  Ingresa el número de cortes evaluados para calcular el porcentaje automáticamente.
                </div>
              )}

              <div className="text-xs text-gray-300 border-l-2 border-emerald-400 p-3 bg-gray-900 rounded space-y-1">
                <span className="font-bold text-emerald-400 block mb-1">Fórmulas Empleadas</span>
                <p>• <strong>% Micorrizas:</strong> (Cortes Micorrizas ÷ Cortes Totales) × 100</p>
                <p>• <strong>% Trichoderma:</strong> (Cortes Trichoderma ÷ Cortes Totales) × 100</p>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: History Table */}
        {(viewMode === 'all' || viewMode === 'table') && (
          <div className={`${viewMode === 'all' ? 'lg:col-span-7' : 'lg:col-span-12'} navi-window p-4 space-y-4`}>
            <div className="border-b border-gray-800 pb-3 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" /> Historial de Colonización Radicular ({records.length})
              </h3>
            </div>

            <div className="overflow-x-auto border border-gray-800 rounded min-h-[320px]">
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
                            <button onClick={() => handleDelete(r.id)} className="text-rose-400 hover:text-rose-300 p-1" title="Eliminar registro">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-400 font-mono text-xs">
                        No hay evaluaciones fúngicas registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
