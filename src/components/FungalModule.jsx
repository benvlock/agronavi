import React, { useState } from 'react';
import { PlusCircle, Trash2, PieChart, Microscope, FlaskConical, CheckCircle, FileText, BarChart3 } from 'lucide-react';

export default function FungalModule({ records, setRecords }) {
  // Active Tab: 'form' | 'table'
  const [activeTab, setActiveTab] = useState('form');

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sampleName, setSampleName] = useState('');
  const [totalCuts, setTotalCuts] = useState('');
  const [micoCuts, setMicoCuts] = useState('');
  const [trichoCuts, setTrichoCuts] = useState('');
  const [notes, setNotes] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');

  // Real-time calculation previews
  const numTotal = Number(totalCuts) || 0;
  const numMico = Number(micoCuts) || 0;
  const numTricho = Number(trichoCuts) || 0;

  const currentMicoPct = numTotal > 0 ? ((numMico / numTotal) * 100).toFixed(1) : '0.0';
  const currentTrichoPct = numTotal > 0 ? ((numTricho / numTotal) * 100).toFixed(1) : '0.0';

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

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
    triggerToast('Evaluación fúngica registrada exitosamente.');

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
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-gray-950 font-bold px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 text-sm animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Navigation Tabs */}
      <div className="navi-window p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-400 flex items-center justify-center">
            <Microscope className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-100">
              Análisis Fúngico en Laboratorio
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Evaluación estereomicroscópica de micorrizas (VAM) y presencia de Trichoderma spp.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-gray-900 p-1.5 border border-gray-800 rounded-lg w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('form')}
            className={`tab-btn flex-1 md:flex-initial justify-center ${activeTab === 'form' ? 'tab-btn-active' : ''}`}
          >
            <FileText className="w-4 h-4" /> Registrar Análisis
          </button>
          <button 
            onClick={() => setActiveTab('table')}
            className={`tab-btn flex-1 md:flex-initial justify-center ${activeTab === 'table' ? 'tab-btn-active' : ''}`}
          >
            <BarChart3 className="w-4 h-4" /> Historial de Colonización ({records.length})
          </button>
        </div>
      </div>

      {/* TAB 1: FORMULARIO Y CALCULADORA EN TIEMPO REAL */}
      {activeTab === 'form' && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Form Side */}
          <div className="md:col-span-7 navi-window p-8 space-y-6">
            <div className="border-b border-gray-800 pb-4">
              <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-400" /> Evaluación de Cortes Radiculares
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Ingresa el recuento de cortes estereomicroscópicos observados.
              </p>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <label className="text-gray-300 font-medium">Fecha de Evaluación *</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full"
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
                  className="w-full"
                />
              </div>

              <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg space-y-4">
                <div>
                  <label className="text-gray-100 font-bold">Total de Cortes Evaluados (N) *</label>
                  <input 
                    type="number" 
                    min="1"
                    placeholder="Ej. 50 cortes"
                    value={totalCuts}
                    onChange={(e) => setTotalCuts(e.target.value)}
                    className="w-full text-base font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sky-400 font-bold">Micorrizas (VAM) *</label>
                    <input 
                      type="number" 
                      min="0"
                      max={totalCuts || undefined}
                      placeholder="Ej. 35"
                      value={micoCuts}
                      onChange={(e) => setMicoCuts(e.target.value)}
                      className="w-full text-base font-bold text-sky-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-emerald-400 font-bold">Trichoderma spp. *</label>
                    <input 
                      type="number" 
                      min="0"
                      max={totalCuts || undefined}
                      placeholder="Ej. 20"
                      value={trichoCuts}
                      onChange={(e) => setTrichoCuts(e.target.value)}
                      className="w-full text-base font-bold text-emerald-400"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-gray-400">Observaciones de Laboratorio</label>
                <input 
                  type="text" 
                  placeholder="Ej. Tinción limpia, vesículas visibles"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full"
                />
              </div>

              <button type="submit" className="btn-navi btn-navi-green w-full justify-center py-3 text-sm font-bold shadow-lg">
                <PlusCircle className="w-5 h-5" /> REGISTRAR EVALUACIÓN FÚNGICA
              </button>
            </form>
          </div>

          {/* Gauges Side */}
          <div className="md:col-span-5 navi-window p-6 space-y-6">
            <div className="border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-sky-400" /> Cálculo en Tiempo Real
              </h3>
            </div>

            {numTotal > 0 ? (
              <div className="space-y-5 p-4 bg-gray-900 border border-gray-800 rounded-lg">
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-mono">
                    <span className="text-sky-400 font-bold">% Colonización Micorrízica</span>
                    <span className="text-sky-400 font-bold text-sm">{currentMicoPct}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-3.5 rounded-full overflow-hidden border border-gray-700">
                    <div className="bg-sky-400 h-full transition-all duration-300" style={{ width: `${Math.min(Number(currentMicoPct), 100)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-mono">
                    <span className="text-emerald-400 font-bold">% Presencia Trichoderma</span>
                    <span className="text-emerald-400 font-bold text-sm">{currentTrichoPct}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-3.5 rounded-full overflow-hidden border border-gray-700">
                    <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${Math.min(Number(currentTrichoPct), 100)}%` }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg text-center text-xs text-gray-400 font-mono">
                Ingresa el total de cortes en el formulario para previsualizar porcentajes.
              </div>
            )}

            <div className="text-xs text-gray-300 border-l-2 border-emerald-400 p-4 bg-gray-900 rounded-lg space-y-2">
              <span className="font-bold text-emerald-400 block border-b border-gray-800 pb-1">Fórmulas Empleadas</span>
              <p>• <strong>% Micorrizas:</strong> (Cortes Micorrizas ÷ Cortes Totales) × 100</p>
              <p>• <strong>% Trichoderma:</strong> (Cortes Trichoderma ÷ Cortes Totales) × 100</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HISTORIAL EN PANTALLA COMPLETA */}
      {activeTab === 'table' && (
        <div className="navi-window p-6 space-y-5">
          <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
            <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" /> Historial de Colonización Radicular ({records.length} evaluaciones)
            </h3>
          </div>

          <div className="overflow-x-auto border border-gray-800 rounded-lg min-h-[350px]">
            <table className="grid-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Muestra Radicular</th>
                  <th>Cortes Evaluados (N)</th>
                  <th>% Colonización Micorrízica</th>
                  <th>% Presencia Trichoderma</th>
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
                        <td className="text-sky-300 font-bold text-xs">{r.totalCuts} cortes</td>
                        <td className="font-bold text-sky-400 text-xs">{mPct}%</td>
                        <td className="font-bold text-emerald-400 text-xs">{tPct}%</td>
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
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-16 text-gray-400 font-mono text-xs">
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
  );
}
