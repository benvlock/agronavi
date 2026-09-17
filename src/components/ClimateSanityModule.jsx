import React, { useState } from 'react';
import { PlusCircle, CloudRain, Thermometer, AlertTriangle, Trash2, Calendar, FileText, BarChart3, CheckCircle } from 'lucide-react';

export default function ClimateSanityModule({ records, setRecords }) {
  // Active Tab: 'form' | 'table'
  const [activeTab, setActiveTab] = useState('form');

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tempMin, setTempMin] = useState('');
  const [tempMax, setTempMax] = useState('');
  const [rainMm, setRainMm] = useState('');
  const [diseaseName, setDiseaseName] = useState('');
  const [diseaseSeverity, setDiseaseSeverity] = useState('Escala 1 (Inicial <5%)');
  const [diseasePct, setDiseasePct] = useState('');
  const [notes, setNotes] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

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
    triggerToast('Lectura climática registrada exitosamente.');

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
          <div className="w-10 h-10 rounded-lg bg-sky-950 border border-sky-400 flex items-center justify-center">
            <CloudRain className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-100">
              Datos Climáticos y Ambientales
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Registro diario de temperaturas (°C), precipitación acumulada (mm) y alertas.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-gray-900 p-1.5 border border-gray-800 rounded-lg w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('form')}
            className={`tab-btn flex-1 md:flex-initial justify-center ${activeTab === 'form' ? 'tab-btn-active' : ''}`}
          >
            <FileText className="w-4 h-4" /> Registrar Clima
          </button>
          <button 
            onClick={() => setActiveTab('table')}
            className={`tab-btn flex-1 md:flex-initial justify-center ${activeTab === 'table' ? 'tab-btn-active' : ''}`}
          >
            <BarChart3 className="w-4 h-4" /> Historial Climático ({records.length})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="navi-window p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-sky-950 border border-sky-400 flex items-center justify-center shrink-0">
            <CloudRain className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-mono">PRECIPITACIÓN ACUMULADA</span>
            <span className="text-xl font-bold text-sky-400 font-mono mt-0.5 block">{totalRain} mm</span>
          </div>
        </div>

        <div className="navi-window p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-950 border border-amber-400 flex items-center justify-center shrink-0">
            <Thermometer className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-mono">TEMPERATURA PROMEDIO</span>
            <span className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">{avgTempGlobal} °C</span>
          </div>
        </div>

        <div className="navi-window p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-rose-950 border border-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-mono">ENFERMEDADES OBSERVADAS</span>
            <span className="text-xl font-bold text-rose-400 font-mono mt-0.5 block">{records.filter(r => r.diseaseName !== 'Sin síntomas visibles').length}</span>
          </div>
        </div>
      </div>

      {/* TAB 1: FORMULARIO ESPACIOSO */}
      {activeTab === 'form' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="navi-window p-8 space-y-6">
            <div className="border-b border-gray-800 pb-4">
              <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" /> Registro de Lectura Meteorológica
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Ingresa las temperaturas y la lluvia medida en la estación o lote de cultivo.
              </p>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-5">
              <div>
                <label className="text-gray-300 font-semibold">Fecha de Registro *</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sky-400 font-bold">Temperatura Mínima (°C) *</label>
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Ej. 18.5"
                    value={tempMin}
                    onChange={(e) => setTempMin(e.target.value)}
                    className="w-full text-base font-bold text-sky-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-amber-400 font-bold">Temperatura Máxima (°C) *</label>
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Ej. 30.2"
                    value={tempMax}
                    onChange={(e) => setTempMax(e.target.value)}
                    className="w-full text-base font-bold text-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sky-400 font-bold">Precipitación / Lluvia (mm) *</label>
                <input 
                  type="number" 
                  step="0.1"
                  placeholder="Ej. 24.5 mm"
                  value={rainMm}
                  onChange={(e) => setRainMm(e.target.value)}
                  className="w-full text-base font-bold text-sky-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-200 font-medium">Enfermedad Foliar Observada (Opcional)</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Roya, Moniliasis"
                    value={diseaseName}
                    onChange={(e) => setDiseaseName(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-amber-400 font-medium">Escala de Severidad</label>
                  <select 
                    value={diseaseSeverity}
                    onChange={(e) => setDiseaseSeverity(e.target.value)}
                    className="w-full"
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

              <div className="pt-2">
                <button type="submit" className="btn-navi btn-navi-green w-full justify-center py-3.5 text-sm font-bold shadow-lg">
                  <PlusCircle className="w-5 h-5" /> REGISTRAR DATO CLIMÁTICO
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
              <Calendar className="w-5 h-5 text-sky-400" /> Historial Climático y Fitosanitario ({records.length} registros)
            </h3>
          </div>

          <div className="overflow-x-auto border border-gray-800 rounded-lg min-h-[350px]">
            <table className="grid-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Temp. Promedio (°C)</th>
                  <th>Precipitación (mm)</th>
                  <th>Enfermedad Observada</th>
                  <th>Severidad Foliar</th>
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
                    <td colSpan="6" className="text-center py-16 text-gray-400 font-mono text-xs">
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
  );
}
