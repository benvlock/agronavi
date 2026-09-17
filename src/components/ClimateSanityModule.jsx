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

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!tempMin || !tempMax) {
      alert('Ingresa las temperaturas mínima y máxima.');
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
      notes: notes || 'Toma diaria de estación/campo'
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
    <div className="horizontal-desktop-track window-slide-right">
      {/* WINDOW 1 (Left): Formulario Registro Agroclimático */}
      <div className="navi-window w-96 shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-sky-400 flex items-center gap-1.5 font-semibold">
            <CloudRain className="w-3.5 h-3.5 text-sky-400" /> CLIMA_REGISTRO.EXE
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-base font-bold text-gray-100 mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
            <Calendar className="w-4 h-4 text-sky-400" /> DATO CLIMÁTICO Y FITOSANITARIO
          </h2>

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
                <label className="text-sky-400 font-semibold">Temp. Mín (°C) *</label>
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
                <label className="text-amber-400 font-semibold">Temp. Máx (°C) *</label>
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
              <label className="text-sky-400 font-semibold">Lluvia / Precipitación (mm) *</label>
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
              <label className="text-gray-200 font-medium">Enfermedad Foliar Observada</label>
              <input 
                type="text" 
                placeholder="Ej. Roya, Monilia..."
                value={diseaseName}
                onChange={(e) => setDiseaseName(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="text-amber-400 font-medium">Severidad Foliar</label>
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

            <button type="submit" className="btn-navi btn-navi-green w-full justify-center h-[38px] mt-2 font-bold">
              <PlusCircle className="w-4 h-4" /> REGISTRAR DATO CLIMÁTICO
            </button>
          </form>
        </div>
      </div>

      {/* WINDOW 2 (Middle): Resumen de Métricas */}
      <div className="navi-window w-72 shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-amber-400 flex items-center gap-1.5 font-semibold">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" /> RESUMEN_METEOROLÓGICO.SYS
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="p-3 bg-gray-900 border border-gray-800 rounded flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-sky-950 border border-sky-400 flex items-center justify-center shrink-0">
              <CloudRain className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block font-mono">LLUVIA ACUMULADA</span>
              <span className="text-base font-bold text-sky-400">{totalRain} mm</span>
            </div>
          </div>

          <div className="p-3 bg-gray-900 border border-gray-800 rounded flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-amber-950 border border-amber-400 flex items-center justify-center shrink-0">
              <Thermometer className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block font-mono">TEMP. PROMEDIO</span>
              <span className="text-base font-bold text-amber-400">{avgTempGlobal} °C</span>
            </div>
          </div>

          <div className="p-3 bg-gray-900 border border-gray-800 rounded flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-rose-950 border border-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block font-mono">ALERTAS ENFERMEDAD</span>
              <span className="text-base font-bold text-rose-400">{records.filter(r => r.diseaseName !== 'Sin síntomas visibles').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* WINDOW 3 (Right): Matriz Histórica */}
      <div className="navi-window w-[520px] shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" /> HISTORIAL_CLIMÁTICO.GRID
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-xs font-bold text-gray-200 mb-3">
            HISTORIAL CLIMÁTICO Y FITOSANITARIO ({records.length})
          </h3>

          <div className="overflow-x-auto border border-gray-700 h-[280px] rounded">
            <table className="grid-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Temp Prom (°C)</th>
                  <th>Lluvia (mm)</th>
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
                        <button onClick={() => handleDelete(r.id)} className="text-rose-400 hover:text-rose-300 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400 font-mono text-xs">
                      No hay datos climáticos registrados.
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
