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
  const avgTempGlobal = records.length > 0 ? (records.reduce((acc, r) => acc + Number(r.tempAvg || 0), 0) / records.length).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Weather & Disease Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="navi-window p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-cyan-950 border border-cyan-400 flex items-center justify-center">
            <CloudRain className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <span className="text-xs text-purple-300 block font-mono">PRECIPITACIÓN ACUMULADA</span>
            <span className="text-xl font-bold text-cyan-400">{totalRain} mm</span>
          </div>
        </div>

        <div className="navi-window p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-orange-950 border border-orange-400 flex items-center justify-center">
            <Thermometer className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <span className="text-xs text-purple-300 block font-mono">TEMPERATURA PROMEDIO</span>
            <span className="text-xl font-bold text-orange-400">{avgTempGlobal} °C</span>
          </div>
        </div>

        <div className="navi-window p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-yellow-950 border border-yellow-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <span className="text-xs text-purple-300 block font-mono">ENFERMEDADES REGISTRADAS</span>
            <span className="text-xl font-bold text-yellow-400">{records.filter(r => r.diseaseName !== 'Sin síntomas visibles').length} Alertas</span>
          </div>
        </div>
      </div>

      {/* Form Input Window */}
      <div className="navi-window">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-cyan-400 flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-yellow-400" /> CLIMATE_PHYTOSANITARY_LOG.EXE
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2 border-b border-purple-800 pb-2">
            <Calendar className="w-5 h-5 text-cyan-400" /> REGISTRO AGROCLIMÁTICO Y FITOSANITARIO FOLIAR
          </h2>

          <form onSubmit={handleAddRecord} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

              <div>
                <label className="text-cyan-400 font-bold">Temperatura Mínima (°C) *</label>
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
                <label className="text-orange-400 font-bold">Temperatura Máxima (°C) *</label>
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-yellow-400 font-bold">Enfermedad Foliar Observada</label>
                <input 
                  type="text" 
                  placeholder="Ej. Roya, Monilia, Antracnosis..."
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

              <div>
                <label>% Incidencia en Hoja (%)</label>
                <input 
                  type="number" 
                  placeholder="Ej. 15%"
                  value={diseasePct}
                  onChange={(e) => setDiseasePct(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label>Notas Agroclimáticas / Fitosanitarias</label>
              <input 
                type="text" 
                placeholder="Ej. Lluvia fuerte en la tarde, humedad relativa alta en el envés"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full"
              />
            </div>

            <button type="submit" className="btn-navi btn-navi-green w-full justify-center">
              <PlusCircle className="w-4 h-4" /> REGISTRAR DATO CLIMÁTICO Y FITOSANITARIO
            </button>
          </form>
        </div>
      </div>

      {/* History Table Window */}
      <div className="navi-window">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-green-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-yellow-400" /> CLIMATE_HISTORY_MATRIX.GRID
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-md font-bold text-yellow-400 mb-4">
            HISTORIAL CLIMÁTICO Y SANIDAD EN HOJAS ({records.length})
          </h3>

          <div className="overflow-x-auto border border-purple-800">
            <table className="grid-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Temp Min / Máx (°C)</th>
                  <th>Temp Prom. (°C)</th>
                  <th>Lluvia (mm)</th>
                  <th>Enfermedad Foliar</th>
                  <th>Severidad</th>
                  <th>% Incidencia</th>
                  <th>Notas</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map((r) => (
                    <tr key={r.id}>
                      <td className="text-xs font-mono text-purple-300">{r.date}</td>
                      <td className="text-xs">{r.tempMin}°C - {r.tempMax}°C</td>
                      <td className="font-bold text-orange-400">{r.tempAvg}°C</td>
                      <td className="font-bold text-cyan-400">{r.rainMm} mm</td>
                      <td className="font-bold text-yellow-300">{r.diseaseName}</td>
                      <td>
                        <span className={`badge-navi ${
                          r.diseaseSeverity.includes('0') ? 'text-green-400 border-green-400' :
                          r.diseaseSeverity.includes('1') || r.diseaseSeverity.includes('2') ? 'text-yellow-400 border-yellow-400' :
                          'text-orange-400 border-orange-400'
                        }`}>
                          {r.diseaseSeverity}
                        </span>
                      </td>
                      <td className="font-bold">{r.diseasePct}%</td>
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
                    <td colSpan="9" className="text-center py-6 text-purple-300 font-mono">
                      No hay datos climáticos ni fitosanitarios registrados.
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
