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
    <div className="space-y-6 window-slide-right font-serif">
      {/* Upper Status Window */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="navi-window p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-orange-950 border border-orange-400 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <span className="text-xs text-purple-300 block font-mono">ENFERMEDADES REGISTRADAS</span>
            <span className="text-xl font-bold text-orange-400">{records.length} Evaluaciones</span>
          </div>
        </div>

        <div className="navi-window p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-yellow-950 border border-yellow-400 flex items-center justify-center">
            <Activity className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <span className="text-xs text-purple-300 block font-mono">% INCIDENCIA LOTE PROM.</span>
            <span className="text-xl font-bold text-yellow-400">
              {records.length > 0 ? (records.reduce((acc, r) => acc + Number(r.lotIncidencePct || 0), 0) / records.length).toFixed(1) : '0.0'}%
            </span>
          </div>
        </div>

        <div className="navi-window p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-purple-950 border border-purple-400 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <span className="text-xs text-purple-300 block font-mono">ÚLTIMO REGISTRO</span>
            <span className="text-base font-bold text-purple-300 font-mono">
              {records.length > 0 ? records[0].date : 'SIN DATOS'}
            </span>
          </div>
        </div>
      </div>

      {/* Form Input Window */}
      <div className="navi-window">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-orange-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" /> PLANT_DISEASE_ASSESSMENT.EXE
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2 border-b border-purple-800 pb-2">
            <ShieldAlert className="w-5 h-5 text-orange-400" /> EVALUACIÓN DE ENFERMEDADES EN PLANTAS (%)
          </h2>

          <form onSubmit={handleAddRecord} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label>Fecha Evaluada *</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label>ID / Código Planta (Individuo)</label>
                <input 
                  type="text" 
                  placeholder="Ej. PLT-IND-001"
                  value={plantId}
                  onChange={(e) => setPlantId(e.target.value)}
                  className="w-full font-mono"
                />
              </div>

              <div>
                <label className="text-yellow-400 font-bold">Patógeno / Enfermedad *</label>
                <input 
                  type="text" 
                  placeholder="Ej. Roya, Moniliasis, Mildiu"
                  value={diseaseName}
                  onChange={(e) => setDiseaseName(e.target.value)}
                  className="w-full font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-orange-400 font-bold">Escala de Severidad</label>
                <select 
                  value={severityScale}
                  onChange={(e) => setSeverityScale(e.target.value)}
                  className="w-full font-bold"
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-purple-950/60 border border-purple-700 rounded">
              <div>
                <label className="text-purple-300 font-bold">Plantas Totales en Lote (N)</label>
                <input 
                  type="number" 
                  min="1"
                  value={lotTotalPlants}
                  onChange={(e) => setLotTotalPlants(e.target.value)}
                  className="w-full font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-orange-400 font-bold">Plantas Infectadas en Lote (n)</label>
                <input 
                  type="number" 
                  min="0"
                  value={lotInfectedPlants}
                  onChange={(e) => setLotInfectedPlants(e.target.value)}
                  className="w-full font-mono text-sm"
                />
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-xs text-yellow-400 font-mono block">INCIDENCIA CALCULADA EN LOTE</span>
                <span className="text-2xl font-bold text-yellow-300 font-mono">{lotIncidencePct}%</span>
              </div>
            </div>

            <div>
              <label>Notas de Síntomas / Tratamiento Biológico</label>
              <input 
                type="text" 
                placeholder="Ej. Lesiones en envés de hojas basales. Aplicación de Trichoderma programada."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full"
              />
            </div>

            <button type="submit" className="btn-navi btn-navi-orange w-full justify-center">
              <PlusCircle className="w-4 h-4" /> REGISTRAR EVALUACIÓN FITOSANITARIA
            </button>
          </form>
        </div>
      </div>

      {/* History Table */}
      <div className="navi-window">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-orange-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" /> DISEASE_EVALUATIONS_LOG.GRID
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-md font-bold text-yellow-400 mb-4">
            MATRIZ DE REGISTROS FITOSANITARIOS ({records.length})
          </h3>

          <div className="overflow-x-auto border border-purple-800">
            <table className="grid-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>ID Planta</th>
                  <th>Patógeno / Enfermedad</th>
                  <th>Severidad Individuo</th>
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
                      <td className="text-xs font-mono text-purple-300">{r.date}</td>
                      <td className="font-mono text-cyan-300">{r.plantId}</td>
                      <td className="font-bold text-yellow-300">{r.diseaseName}</td>
                      <td>
                        <span className="badge-navi text-orange-400 border-orange-400">
                          {r.severityScale}
                        </span>
                      </td>
                      <td className="text-xs">{r.lotInfectedPlants} / {r.lotTotalPlants} plantas</td>
                      <td className="font-bold text-yellow-400">{r.lotIncidencePct}%</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-purple-300 font-mono">
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
