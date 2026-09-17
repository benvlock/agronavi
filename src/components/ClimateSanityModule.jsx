import React, { useState } from 'react';
import { PlusCircle, CloudRain, Thermometer, AlertTriangle, Trash2, Calendar } from 'lucide-react';

export default function ClimateSanityModule({ records, setRecords }) {
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tempMin, setTempMin] = useState('');
  const [tempMax, setTempMax] = useState('');
  const [rainMm, setRainMm] = useState('');
  const [diseaseName, setDiseaseName] = useState('');
  const [diseaseSeverity, setDiseaseSeverity] = useState('Escala 1 (Inicial <5%)');
  const [diseasePct, setDiseasePct] = useState('');
  const [notes, setNotes] = useState('');

  // Sub-view Mode
  const [viewMode, setViewMode] = useState('all'); // 'all' | 'form' | 'table'

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!tempMin || !tempMax) {
      alert('Por favor ingresa las temperaturas mínima y máxima.');
      return;
    }

    const tMin = Number(tempMin);
    const tMax = Number(tempMax);
    const tAvg = ((tMin + tMax) / 2).toFixed(1);

    const newRec = {
      id: `c-${Date.now()}`,
      date: date || new Date().toISOString().split('T')[0],
      tempMin: tMin,
      tempMax: tMax,
      tempAvg: Number(tAvg),
      rainMm: Number(rainMm || 0),
      diseaseName: diseaseName || 'Sin síntomas visibles',
      diseaseSeverity,
      diseasePct: Number(diseasePct || 0),
      notes: notes || 'Toma diaria de estación o campo'
    };

    setRecords([newRec, ...records]);

    // Reset
    setTempMin('');
    setTempMax('');
    setRainMm('');
    setDiseaseName('');
    setDiseasePct('');
    setNotes('');
  };

  const handleDelete = (id) => {
    setRecords(records.filter(r => r.id !== id));
  };

  // Weather averages
  const totalRain = records.reduce((acc, r) => acc + Number(r.rainMm || 0), 0).toFixed(1);
  const avgTempGlobal = records.length > 0 ? (records.reduce((acc, r) => acc + Number(r.tempAvg || 0), 0) / records.length).toFixed(1) : '0.0';

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="navi-window p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-gray-100">
              Datos Climáticos y Ambientales
            </h2>
            <span className="text-xs bg-sky-950 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded font-mono">
              Estación & Campo
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Registro diario de temperatura (°C), precipitación (mm) y eventos climáticos.
          </p>
        </div>

        {/* View Mode Toggle Menu */}
        <div className="flex items-center gap-1.5 bg-gray-900 p-1 border border-gray-800 rounded">
          <button 
            onClick={() => setViewMode('all')}
            className={`px-2.5 py-1 text-xs rounded font-semibold transition-all ${
              viewMode === 'all' ? 'bg-sky-500 text-gray-950 shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Vista Completa
          </button>
          <button 
            onClick={() => setViewMode('form')}
            className={`px-2.5 py-1 text-xs rounded font-semibold transition-all ${
              viewMode === 'form' ? 'bg-sky-500 text-gray-950 shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Formulario
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 text-xs rounded font-semibold transition-all ${
              viewMode === 'table' ? 'bg-sky-500 text-gray-950 shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Historial ({records.length})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="navi-window p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-sky-950 border border-sky-400 flex items-center justify-center shrink-0">
            <CloudRain className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-mono">PRECIPITACIÓN ACUMULADA</span>
            <span className="text-lg font-bold text-sky-400">{totalRain} mm</span>
          </div>
        </div>

        <div className="navi-window p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-amber-950 border border-amber-400 flex items-center justify-center shrink-0">
            <Thermometer className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-mono">TEMPERATURA PROMEDIO</span>
            <span className="text-lg font-bold text-amber-400">{avgTempGlobal} °C</span>
          </div>
        </div>

        <div className="navi-window p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-rose-950 border border-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-mono">ENFERMEDADES OBSERVADAS</span>
            <span className="text-lg font-bold text-rose-400">{records.filter(r => r.diseaseName !== 'Sin síntomas visibles').length}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Form */}
        {(viewMode === 'all' || viewMode === 'form') && (
          <div className={`${viewMode === 'all' ? 'lg:col-span-5' : 'lg:col-span-12'} navi-window p-5 space-y-4`}>
            <div className="border-b border-gray-800 pb-2">
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400" /> Registro de Lectura Climática
              </h3>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium">Fecha de Registro *</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sky-400 font-semibold">Temp. Mínima (°C) *</label>
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Ej. 18.5"
                    value={tempMin}
                    onChange={(e) => setTempMin(e.target.value)}
                    className="w-full font-semibold text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-amber-400 font-semibold">Temp. Máxima (°C) *</label>
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Ej. 30.2"
                    value={tempMax}
                    onChange={(e) => setTempMax(e.target.value)}
                    className="w-full font-semibold text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sky-400 font-semibold">Precipitación / Lluvia (mm) *</label>
                <input 
                  type="number" 
                  step="0.1"
                  placeholder="Ej. 24.5 mm"
                  value={rainMm}
                  onChange={(e) => setRainMm(e.target.value)}
                  className="w-full font-semibold text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-gray-200 font-medium">Enfermedad Foliar Observada (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ej. Roya, Moniliasis"
                  value={diseaseName}
                  onChange={(e) => setDiseaseName(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div>
                <label className="text-amber-400 font-medium">Escala de Severidad</label>
                <select 
                  value={diseaseSeverity}
                  onChange={(e) => setDiseaseSeverity(e.target.value)}
                  className="w-full text-xs"
                >
                  <option value="Escala 0 (Sano 0%)">Escala 0 (Sano 0%)</option>
                  <option value="Escala 1 (Inicial <5%)">Escala 1 (Inicial &lt;5%)</option>
                  <option value="Escala 2 (Leve 10-20%)">Escala 2 (Leve 10-20%)</option>
                  <option value="Escala 3 (Moderado 25-40%)">Escala 3 (Moderado 25-40%)</option>
                  <option value="Escala 4 (Severo 40-60%)">Escala 4 (Severo 40-60%)</option>
                  <option value="Escala 5 (Muy Severo >60%)">Escala 5 (Muy Severo &gt;60%)</option>
                </select>
              </div>

              <button type="submit" className="btn-navi btn-navi-green w-full justify-center h-[38px] mt-1 font-bold">
                <PlusCircle className="w-4 h-4" /> REGISTRAR DATO CLIMÁTICO
              </button>
            </form>
          </div>
        )}

        {/* Right Column: Table */}
        {(viewMode === 'all' || viewMode === 'table') && (
          <div className={`${viewMode === 'all' ? 'lg:col-span-7' : 'lg:col-span-12'} navi-window p-4 space-y-4`}>
            <div className="border-b border-gray-800 pb-3 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400" /> Historial Climático y Fitosanitario ({records.length})
              </h3>
            </div>

            <div className="overflow-x-auto border border-gray-800 rounded min-h-[300px]">
              <table className="grid-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Temp. Prom (°C)</th>
                    <th>Precipitación (mm)</th>
                    <th>Enfermedad</th>
                    <th>Severidad</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length > 0 ? (
                    records.map((r) => (
                      <tr key={r.id}>
                        <td className="text-xs font-mono text-gray-400">{r.date}</td>
                        <td className="font-bold text-amber-400 text-xs">{r.tempAvg}°C</td>
                        <td className="font-bold text-sky-400 text-xs">{r.rainMm} mm</td>
                        <td className="font-semibold text-gray-200 text-xs">{r.diseaseName}</td>
                        <td>
                          <span className="badge-navi text-amber-400 border-amber-400/60 text-[10px]">
                            {r.diseaseSeverity}
                          </span>
                        </td>
                        <td>
                          <button onClick={() => handleDelete(r.id)} className="text-rose-400 hover:text-rose-300 p-1" title="Eliminar registro">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-400 font-mono text-xs">
                        No hay registros climáticos guardados.
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
