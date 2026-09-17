import React, { useState } from 'react';
import { PlusCircle, ShieldAlert, Trash2, Calendar, Activity, CheckCircle, FileText, BarChart3 } from 'lucide-react';

export default function DiseaseModule({ records, setRecords }) {
  // Active Tab: 'form' | 'table'
  const [activeTab, setActiveTab] = useState('form');

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [plantId, setPlantId] = useState('');
  const [diseaseName, setDiseaseName] = useState('');
  const [severityScale, setSeverityScale] = useState('Escala 2 (Leve 10-20%)');
  const [affectedPct, setAffectedPct] = useState('');
  const [lotTotalPlants, setLotTotalPlants] = useState('100');
  const [lotInfectedPlants, setLotInfectedPlants] = useState('15');
  const [notes, setNotes] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');

  // Calculations
  const numLotTotal = Number(lotTotalPlants) || 0;
  const numLotInfected = Number(lotInfectedPlants) || 0;
  const lotIncidencePct = numLotTotal > 0 ? ((numLotInfected / numLotTotal) * 100).toFixed(1) : '0.0';

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!diseaseName) {
      alert('Por favor ingresa el nombre de la enfermedad o patógeno observado.');
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
      notes: notes || 'Evaluación fitosanitaria en lote'
    };

    setRecords([newRec, ...records]);
    triggerToast('Evaluación fitosanitaria registrada exitosamente.');

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
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-gray-950 font-bold px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 text-sm animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="navi-window p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-100">
              Fitosanidad y Evaluación de Enfermedades
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Registro de severidad foliar e incidencia fitosanitaria por lotes de cultivo.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-gray-900 p-1.5 border border-gray-800 rounded-lg w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('form')}
            className={`tab-btn flex-1 md:flex-initial justify-center ${activeTab === 'form' ? 'tab-btn-active' : ''}`}
          >
            <FileText className="w-4 h-4" /> Registrar Fitosanidad
          </button>
          <button 
            onClick={() => setActiveTab('table')}
            className={`tab-btn flex-1 md:flex-initial justify-center ${activeTab === 'table' ? 'tab-btn-active' : ''}`}
          >
            <BarChart3 className="w-4 h-4" /> Historial Fitosanitario ({records.length})
          </button>
        </div>
      </div>

      {/* Status KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="navi-window p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-950 border border-amber-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-mono">EVALUACIONES REGISTRADAS</span>
            <span className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">{records.length} Registros</span>
          </div>
        </div>

        <div className="navi-window p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-mono">INCIDENCIA LOTE PROMEDIO</span>
            <span className="text-xl font-bold text-sky-400 font-mono mt-0.5 block">
              {records.length > 0 ? (records.reduce((acc, r) => acc + Number(r.lotIncidencePct || 0), 0) / records.length).toFixed(1) : '0.0'}%
            </span>
          </div>
        </div>

        <div className="navi-window p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-mono">ÚLTIMO REGISTRO</span>
            <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">
              {records.length > 0 ? records[0].date : 'Sin Registros'}
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: FORMULARIO ESPACIOSO */}
      {activeTab === 'form' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="navi-window p-8 space-y-6">
            <div className="border-b border-gray-800 pb-4">
              <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" /> Formulario de Registro Fitosanitario
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Evalúa patógenos observados, escala de severidad e incidencia porcentual de lote.
              </p>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 font-semibold">Fecha Evaluada *</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold">ID / Código Planta (Individuo)</label>
                  <input 
                    type="text" 
                    placeholder="Ej. PLT-IND-001"
                    value={plantId}
                    onChange={(e) => setPlantId(e.target.value)}
                    className="w-full font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-amber-400 font-bold">Patógeno / Enfermedad *</label>
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
                  <label className="text-gray-200 font-semibold">Escala de Severidad</label>
                  <select 
                    value={severityScale}
                    onChange={(e) => setSeverityScale(e.target.value)}
                    className="w-full font-semibold"
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
              <div className="p-5 bg-gray-900 border border-gray-800 rounded-lg space-y-4">
                <span className="text-xs font-bold text-gray-200 block border-b border-gray-800 pb-2">
                  CÁLCULO DE INCIDENCIA EN LOTE
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-300 font-semibold">Plantas Totales en Lote (N)</label>
                    <input 
                      type="number" 
                      min="1"
                      value={lotTotalPlants}
                      onChange={(e) => setLotTotalPlants(e.target.value)}
                      className="w-full font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-amber-400 font-semibold">Plantas Infectadas en Lote (n)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={lotInfectedPlants}
                      onChange={(e) => setLotInfectedPlants(e.target.value)}
                      className="w-full font-mono text-sm"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="text-xs text-gray-400 font-mono block">INCIDENCIA DEL LOTE</span>
                    <span className="text-2xl font-bold text-sky-400 font-mono mt-1">{lotIncidencePct}%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-gray-400">Observaciones Fitosanitarias</label>
                <input 
                  type="text" 
                  placeholder="Ej. Síntomas en envés foliar. Aplicación biológica programada."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="btn-navi btn-navi-yellow w-full justify-center py-3.5 text-sm font-bold shadow-lg">
                  <PlusCircle className="w-5 h-5" /> REGISTRAR EVALUACIÓN FITOSANITARIA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: HISTORIAL EN PANTALLA COMPLETA */}
      {activeTab === 'table' && (
        <div className="navi-window p-6 space-y-5">
          <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
            <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" /> Historial de Registros Fitosanitarios ({records.length} evaluaciones)
            </h3>
          </div>

          <div className="overflow-x-auto border border-gray-800 rounded-lg min-h-[350px]">
            <table className="grid-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>ID Planta</th>
                  <th>Patógeno / Enfermedad</th>
                  <th>Severidad</th>
                  <th>Lote (Infectadas / Total)</th>
                  <th>% Incidencia Lote</th>
                  <th>Observaciones</th>
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
                          className="text-rose-400 hover:text-rose-300 p-1.5 hover:bg-rose-950/40 rounded transition-all"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-16 text-gray-400 font-mono text-xs">
                      No hay registros de fitosanidad guardados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
