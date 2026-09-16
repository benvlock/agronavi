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
          <span className="font-mono text-xs text-cyan-400 flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-yellow-400" /> CLIMATE_LOG_FORM.EXE
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2 border-b border-purple-800 pb-2">
            <Calendar className="w-5 h-5 text-cyan-400" /> REGISTRO AGROCLIMÁTICO
          </h2>

          <form onSubmit={handleAddRecord} className="space-y-3 text-xs">
            <div>
              <label>Fecha de Registro *</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-cyan-400 font-bold">Temp. Mín (°C) *</label>
                <input 
                  type="number" 
                  step="0.1"
                  placeholder="Ej. 18.5"
                  value={tempMin}
                  onChange={(e) => setTempMin(e.target.value)}
                  className="w-full font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-orange-400 font-bold">Temp. Máx (°C) *</label>
                <input 
                  type="number" 
                  step="0.1"
                  placeholder="Ej. 30.2"
                  value={tempMax}
                  onChange={(e) => setTempMax(e.target.value)}
                  className="w-full font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-cyan-400 font-bold">Lluvia / Precipitación (mm) *</label>
              <input 
                type="number" 
                step="0.1"
                placeholder="Ej. 24.5 mm"
                value={rainMm}
                onChange={(e) => setRainMm(e.target.value)}
                className="w-full font-bold"
                required
              />
            </div>

            <div>
              <label className="text-yellow-400 font-bold">Enfermedad Foliar Observada</label>
              <input 
                type="text" 
                placeholder="Ej. Roya, Monilia..."
                value={diseaseName}
                onChange={(e) => setDiseaseName(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-orange-400 font-bold">Severidad Foliar</label>
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

            <button type="submit" className="btn-navi btn-navi-green w-full justify-center h-[40px] mt-2">
              <PlusCircle className="w-4 h-4" /> REGISTRAR CLIMA
            </button>
          </form>
        </div>
      </div>

      {/* WINDOW 2 (Middle): Resumen de Métricas */}
      <div className="navi-window w-72 shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-orange-400 flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-yellow-400" /> METEOROLOGICAL_SUMMARY.SYS
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="navi-window p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-cyan-950 border border-cyan-400 flex items-center justify-center shrink-0">
              <CloudRain className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] text-purple-300 block font-mono">LLUVIA TOTAL</span>
              <span className="text-lg font-bold text-cyan-400">{totalRain} mm</span>
            </div>
          </div>

          <div className="navi-window p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-orange-950 border border-orange-400 flex items-center justify-center shrink-0">
              <Thermometer className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <span className="text-[10px] text-purple-300 block font-mono">TEMP. PROMEDIO</span>
              <span className="text-lg font-bold text-orange-400">{avgTempGlobal} °C</span>
            </div>
          </div>

          <div className="navi-window p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-yellow-950 border border-yellow-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <span className="text-[10px] text-purple-300 block font-mono">ALERTAS FITOSANITARIAS</span>
              <span className="text-lg font-bold text-yellow-400">{records.filter(r => r.diseaseName !== 'Sin síntomas visibles').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* WINDOW 3 (Right): Matriz Histórica */}
      <div className="navi-window w-[520px] shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-green-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-yellow-400" /> CLIMATE_MATRIX.GRID
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-xs font-bold text-yellow-400 mb-3">
            HISTORIAL CLIMÁTICO Y FITOSANITARIO ({records.length})
          </h3>

          <div className="overflow-x-auto border border-purple-800 h-[280px]">
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
                      <td className="text-xs font-mono text-purple-300">{r.date}</td>
                      <td className="font-bold text-orange-400 text-xs">{r.tempAvg}°C</td>
                      <td className="font-bold text-cyan-400 text-xs">{r.rainMm} mm</td>
                      <td className="font-bold text-yellow-300 text-xs">{r.diseaseName}</td>
                      <td>
                        <span className="badge-navi text-orange-400 border-orange-400 text-[10px]">
                          {r.diseaseSeverity}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-300 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-purple-300 font-mono text-xs">
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
