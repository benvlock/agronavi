import React, { useState } from 'react';
import { PlusCircle, ShieldAlert, Trash2, Calendar, Activity } from 'lucide-react';

export default function DiseaseModule({ records, setRecords }) {
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [plantId, setPlantId] = useState('');
  const [diseaseName, setDiseaseName] = useState('');
  const [severityScale, setSeverityScale] = useState('Escala 2 (Leve 10-20%)');
  const [affectedPct, setAffectedPct] = useState('');
  const [lotTotalPlants, setLotTotalPlants] = useState('100');
  const [lotInfectedPlants, setLotInfectedPlants] = useState('15');
  const [notes, setNotes] = useState('');

  // Calculations
  const numLotTotal = Number(lotTotalPlants) || 0;
  const numLotInfected = Number(lotInfectedPlants) || 0;
  const lotIncidencePct = numLotTotal > 0 ? ((numLotInfected / numLotTotal) * 100).toFixed(1) : '0.0';

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!diseaseName) {
      alert('Ingresa el nombre o tipo de enfermedad observada.');
      return;
    }

    const newRec = {
      id: `d-${Date.now()}`,
      date: date || new Date().toISOString().split('T')[0],
      plantId: plantId || `PLT-IND-${records.length + 1}`,
      diseaseName,
      severityScale,
      affectedPct: Number(affectedPct || 0),
      lotTotalPlants: numLotTotal,
      lotInfectedPlants: numLotInfected,
      lotIncidencePct: Number(lotIncidencePct),
      notes: notes || 'Evaluación fitosanitaria individual y de lote'
    };

    setRecords([newRec, ...records]);

    // Reset
    setPlantId('');
    setDiseaseName('');
    setAffectedPct('');
    setNotes('');
  };

  const handleDelete = (id) => {
    setRecords(records.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6 window-slide-right">
      {/* Upper Status Window */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="navi-window p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-amber-950 border border-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-mono">EVALUACIONES FITOSANITARIAS</span>
            <span className="text-xl font-bold text-amber-400">{records.length} Registros</span>
          </div>
        </div>

        <div className="navi-window p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gray-900 border border-gray-700 flex items-center justify-center">
            <Activity className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-mono">% INCIDENCIA LOTE PROM.</span>
            <span className="text-xl font-bold text-sky-400">
              {records.length > 0 ? (records.reduce((acc, r) => acc + Number(r.lotIncidencePct || 0), 0) / records.length).toFixed(1) : '0.0'}%
            </span>
          </div>
        </div>

        <div className="navi-window p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gray-900 border border-gray-700 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-mono">ÚLTIMO REGISTRO</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              {records.length > 0 ? records[0].date : 'SIN DATOS'}
            </span>
          </div>
        </div>
      </div>

      {/* Form Input Window */}
      <div className="navi-window">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-amber-400 flex items-center gap-1.5 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> FITOSANIDAD_EVALUACIÓN.EXE
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-base font-bold text-gray-100 mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> REGISTRO DE FITOSANIDAD Y ENFERMEDADES
          </h2>

          <form onSubmit={handleAddRecord} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-gray-300 font-medium">Fecha Evaluada *</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">ID / Código Planta</label>
                <input 
                  type="text" 
                  placeholder="Ej. PLT-IND-001"
                  value={plantId}
                  onChange={(e) => setPlantId(e.target.value)}
                  className="w-full font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-amber-400 font-semibold">Patógeno / Enfermedad *</label>
                <input 
                  type="text" 
                  placeholder="Ej. Roya, Moniliasis, Mildiu"
                  value={diseaseName}
                  onChange={(e) => setDiseaseName(e.target.value)}
                  className="w-full font-semibold text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-gray-200 font-semibold">Escala de Severidad</label>
                <select 
                  value={severityScale}
                  onChange={(e) => setSeverityScale(e.target.value)}
                  className="w-full text-xs font-semibold"
                >
                  <option value="Escala 0 (Sano 0%)">Escala 0 (Sano 0%)</option>
                  <option value="Escala 1 (Inicial <5%)">Escala 1 (Inicial &lt;5%)</option>
                  <option value="Escala 2 (Leve 10-20%)">Escala 2 (Leve 10-20%)</option>
                  <option value="Escala 3 (Moderado 25-40%)">Escala 3 (Moderado 25-40%)</option>
                  <option value="Escala 4 (Severo 40-60%)">Escala 4 (Severo 40-60%)</option>
                  <option value="Escala 5 (Muy Severo >60%)">Escala 5 (Muy Severo &gt;60%)</option>
                </select>
              </div>
            </div>

            {/* Lot General Incidence Calculation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-900 border border-gray-800 rounded">
              <div>
                <label className="text-gray-300 font-semibold text-xs">Plantas Totales en Lote (N)</label>
                <input 
                  type="number" 
                  min="1"
                  value={lotTotalPlants}
                  onChange={(e) => setLotTotalPlants(e.target.value)}
                  className="w-full font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-amber-400 font-semibold text-xs">Plantas Infectadas en Lote (n)</label>
                <input 
                  type="number" 
                  min="0"
                  value={lotInfectedPlants}
                  onChange={(e) => setLotInfectedPlants(e.target.value)}
                  className="w-full font-mono text-xs"
                />
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-[11px] text-gray-400 font-mono block">INCIDENCIA CALCULADA DE LOTE</span>
                <span className="text-xl font-bold text-sky-400 font-mono">{lotIncidencePct}%</span>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs">Notas Fitosanitarias</label>
              <input 
                type="text" 
                placeholder="Ej. Lesiones en envés de hojas basales. Aplicación biológica programada."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <button type="submit" className="btn-navi btn-navi-yellow w-full justify-center font-bold h-[38px]">
              <PlusCircle className="w-4 h-4" /> REGISTRAR EVALUACIÓN FITOSANITARIA
            </button>
          </form>
        </div>
      </div>

      {/* History Table */}
      <div className="navi-window">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-gray-300 flex items-center gap-1.5 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> HISTORIAL_FITOSANITARIO.GRID
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-xs font-bold text-gray-200 mb-3">
            REGISTROS FITOSANITARIOS ({records.length})
          </h3>

          <div className="overflow-x-auto border border-gray-700 rounded">
            <table className="grid-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>ID Planta</th>
                  <th>Patógeno / Enfermedad</th>
                  <th>Severidad</th>
                  <th>Plantas Lote (Infectadas / Total)</th>
                  <th>% Incidencia Lote</th>
                  <th>Notas</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map((r) => (
                    <tr key={r.id}>
                      <td className="text-xs font-mono text-gray-400">{r.date}</td>
                      <td className="font-mono text-sky-300 text-xs">{r.plantId}</td>
                      <td className="font-bold text-amber-400 text-xs">{r.diseaseName}</td>
                      <td>
                        <span className="badge-navi text-amber-400 border-amber-400/60 text-[10px]">
                          {r.severityScale}
                        </span>
                      </td>
                      <td className="text-xs text-gray-300">{r.lotInfectedPlants} / {r.lotTotalPlants} plantas</td>
                      <td className="font-bold text-sky-400 text-xs">{r.lotIncidencePct}%</td>
                      <td className="text-xs text-gray-400 max-w-xs truncate">{r.notes}</td>
                      <td>
                        <button 
                          onClick={() => handleDelete(r.id)} 
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-400 font-mono text-xs">
                      No hay registros de enfermedades en plantas.
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
