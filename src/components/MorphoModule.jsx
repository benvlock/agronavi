import React, { useState, useMemo } from 'react';
import { PlusCircle, Zap, Trash2, Search, BarChart3, ChevronLeft, ChevronRight, Leaf, Target, Filter, FileText, Layers, CheckCircle } from 'lucide-react';

export default function MorphoModule({ records, setRecords }) {
  // Config state - capacity up to 25,000
  const [maxCapacity, setMaxCapacity] = useState(25000);
  const [batchCount, setBatchCount] = useState(500);
  const [batchBlockName, setBatchBlockName] = useState('Bloque A');

  // Primary Tab Navigation: 'form' | 'table' | 'batch'
  const [activeTab, setActiveTab] = useState('form');

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [blockId, setBlockId] = useState('Bloque A');
  const [treatment, setTreatment] = useState('T1 - Bioestimulante');
  const [leaves, setLeaves] = useState('');
  const [diameter, setDiameter] = useState('');
  const [length, setLength] = useState('');
  const [plantId, setPlantId] = useState('');
  const [notes, setNotes] = useState('');

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState('');

  // Pagination & Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlockFilter, setSelectedBlockFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Unique blocks list for filter dropdown
  const uniqueBlocks = useMemo(() => {
    const blocks = new Set(records.map(r => r.blockId || 'Sin Bloque'));
    return Array.from(blocks);
  }, [records]);

  // Show Toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Manual record submission
  const handleAddRecord = (e) => {
    e.preventDefault();
    if (records.length >= maxCapacity) {
      alert(`Has alcanzado la capacidad máxima configurada de ${maxCapacity.toLocaleString()} muestras.`);
      return;
    }
    if (!leaves || !diameter || !length) {
      alert('Por favor completa Número de hojas, Diámetro y Largo o Altura de la planta.');
      return;
    }

    const nextNo = records.length + 1;
    const newRec = {
      id: `m-${Date.now()}-${Math.random()}`,
      sampleNo: nextNo,
      blockId: blockId || 'Bloque General',
      treatment: treatment || 'Control',
      plantId: plantId || `PLT-${String(nextNo).padStart(5, '0')}`,
      leaves: parseInt(leaves, 10),
      diameter: parseFloat(diameter).toFixed(2),
      height: parseFloat(length).toFixed(1),
      date: date || new Date().toISOString().split('T')[0],
      notes: notes || 'Entrada manual'
    };

    setRecords([newRec, ...records]);
    triggerToast(`Muestra #${nextNo} registrada exitosamente.`);

    // Reset numeric fields
    setLeaves('');
    setDiameter('');
    setLength('');
    setPlantId('');
    setNotes('');
  };

  // Quick Batch Generator for large sampling (up to 25,000)
  const handleGenerateBatch = () => {
    const count = Math.min(Number(batchCount), maxCapacity - records.length);
    if (count <= 0) {
      alert(`Límite máximo de ${maxCapacity.toLocaleString()} muestras alcanzado.`);
      return;
    }

    const newBatch = [];
    const baseNo = records.length;
    const currentBlock = batchBlockName.trim() || 'Bloque Lote';
    const currentDate = new Date().toISOString().split('T')[0];

    for (let i = 0; i < count; i++) {
      const idx = baseNo + i + 1;
      newBatch.push({
        id: `m-batch-${Date.now()}-${i}`,
        sampleNo: idx,
        blockId: currentBlock,
        treatment: 'Tratamiento Campo',
        plantId: `PLT-${String(idx).padStart(5, '0')}`,
        leaves: Math.floor(6 + Math.random() * 14),
        diameter: (2.5 + Math.random() * 6.5).toFixed(2),
        height: (20 + Math.random() * 50).toFixed(1),
        date: currentDate,
        notes: `Muestra en Lote (${currentBlock})`
      });
    }

    setRecords([...records, ...newBatch]);
    triggerToast(`Se generaron ${count.toLocaleString()} muestras para el ${currentBlock}.`);
  };

  // Delete individual record
  const handleDeleteRecord = (id) => {
    setRecords(records.filter(r => r.id !== id));
  };

  // Clear all records
  const handleClearAll = () => {
    if (window.confirm('¿Seguro que deseas vaciar todas las muestras morfológicas registradas?')) {
      setRecords([]);
      setCurrentPage(1);
      triggerToast('Se han vaciado todas las muestras morfológicas.');
    }
  };

  // Filter & Pagination Calculations
  const filteredRecords = useMemo(() => {
    let result = records;
    if (selectedBlockFilter !== 'ALL') {
      result = result.filter(r => (r.blockId || 'Sin Bloque') === selectedBlockFilter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r => 
        r.plantId?.toLowerCase().includes(term) || 
        r.blockId?.toLowerCase().includes(term) ||
        r.treatment?.toLowerCase().includes(term) ||
        String(r.sampleNo).includes(term) ||
        r.notes?.toLowerCase().includes(term)
      );
    }
    return result;
  }, [records, searchTerm, selectedBlockFilter]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  // Statistical summary
  const stats = useMemo(() => {
    if (records.length === 0) return { avgH: '0.0', avgD: '0.00', avgL: '0.0', blockCount: 0 };
    const heights = records.map(r => Number(r.height));
    const diameters = records.map(r => Number(r.diameter));
    const leavesList = records.map(r => Number(r.leaves));
    const blocks = new Set(records.map(r => r.blockId));

    const sumH = heights.reduce((a, b) => a + b, 0);
    const sumD = diameters.reduce((a, b) => a + b, 0);
    const sumL = leavesList.reduce((a, b) => a + b, 0);

    return {
      avgH: (sumH / records.length).toFixed(1),
      avgD: (sumD / records.length).toFixed(2),
      avgL: (sumL / records.length).toFixed(1),
      blockCount: blocks.size
    };
  }, [records]);

  const progressPct = maxCapacity > 0 ? ((records.length / maxCapacity) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-gray-950 font-bold px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 text-sm animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Module Title Header */}
      <div className="navi-window p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-400 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100">
                Morfología de Planta
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Evaluación de crecimiento foliar, diámetro basal y largo de planta por bloques y tratamientos.
              </p>
            </div>
          </div>
        </div>

        {/* Spacious Module Tabs Bar */}
        <div className="flex items-center gap-2 bg-gray-900 p-1.5 border border-gray-800 rounded-lg w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('form')}
            className={`tab-btn flex-1 md:flex-initial justify-center ${activeTab === 'form' ? 'tab-btn-active' : ''}`}
          >
            <FileText className="w-4 h-4" /> Registrar Muestra
          </button>
          <button 
            onClick={() => setActiveTab('table')}
            className={`tab-btn flex-1 md:flex-initial justify-center ${activeTab === 'table' ? 'tab-btn-active' : ''}`}
          >
            <BarChart3 className="w-4 h-4" /> Historial de Datos ({records.length.toLocaleString()})
          </button>
          <button 
            onClick={() => setActiveTab('batch')}
            className={`tab-btn flex-1 md:flex-initial justify-center ${activeTab === 'batch' ? 'tab-btn-active' : ''}`}
          >
            <Zap className="w-4 h-4" /> Generar Lotes ({maxCapacity.toLocaleString()})
          </button>
        </div>
      </div>

      {/* TAB 1: FORMULARIO AMPLIO Y DESPEJADO */}
      {activeTab === 'form' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="navi-window p-8 space-y-6">
            <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-400" /> Captura de Muestra Individual
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Ingresa los parámetros evaluados en campo para la planta seleccionada.
                </p>
              </div>
              <span className="text-xs bg-gray-900 border border-gray-800 text-emerald-400 font-mono font-bold px-3 py-1.5 rounded-md">
                Próxima Muestra: #{records.length + 1}
              </span>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-5">
              {/* Bloque, Fecha y Tratamiento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-300 font-semibold">Fecha de Evaluación *</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="text-emerald-400 font-semibold">Bloque / Parcela *</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Bloque A"
                    value={blockId}
                    onChange={(e) => setBlockId(e.target.value)}
                    className="w-full font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold">Tratamiento / Ensayo</label>
                  <input 
                    type="text" 
                    placeholder="Ej. T1 - Bioestimulante"
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Parámetros Numéricos Medidos */}
              <div className="p-5 bg-gray-900/80 border border-gray-800 rounded-lg space-y-4">
                <span className="text-xs font-bold text-gray-200 block border-b border-gray-800 pb-2">
                  PARÁMETROS MORFOLÓGICOS OBLIGATORIOS
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-amber-400 font-bold">1. Número de Hojas *</label>
                    <input 
                      type="number" 
                      placeholder="Ej. 12"
                      value={leaves}
                      onChange={(e) => setLeaves(e.target.value)}
                      className="w-full text-base font-bold text-amber-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-cyan-400 font-bold">2. Diámetro Basal (mm) *</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="Ej. 5.80"
                      value={diameter}
                      onChange={(e) => setDiameter(e.target.value)}
                      className="w-full text-base font-bold text-cyan-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-emerald-400 font-bold">3. Largo / Altura (cm) *</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      placeholder="Ej. 42.5"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full text-base font-bold text-emerald-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Opcionales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300">ID de Planta / Etiqueta (Opcional)</label>
                  <input 
                    type="text" 
                    placeholder="Ej. PLT-00125"
                    value={plantId}
                    onChange={(e) => setPlantId(e.target.value)}
                    className="w-full font-mono"
                  />
                </div>

                <div>
                  <label className="text-gray-400">Observaciones</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Vigor foliar alto, sin síntomas"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="btn-navi btn-navi-green w-full justify-center py-3.5 text-sm font-bold shadow-lg"
                >
                  <PlusCircle className="w-5 h-5" /> REGISTRAR MUESTRA EN SISTEMA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: HISTORIAL DE DATOS Y TABLA COMPLETA (25,000 MUESTRAS) */}
      {activeTab === 'table' && (
        <div className="space-y-6">
          {/* KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="navi-window p-4">
              <span className="text-gray-400 text-xs block font-mono">TOTAL MUESTRAS</span>
              <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">{records.length.toLocaleString()}</span>
            </div>
            <div className="navi-window p-4">
              <span className="text-gray-400 text-xs block font-mono">BLOQUES ACTIVOS</span>
              <span className="text-xl font-bold text-sky-400 font-mono mt-1 block">{stats.blockCount}</span>
            </div>
            <div className="navi-window p-4">
              <span className="text-gray-400 text-xs block font-mono">HOJAS PROMEDIO</span>
              <span className="text-xl font-bold text-amber-400 font-mono mt-1 block">{stats.avgL}</span>
            </div>
            <div className="navi-window p-4">
              <span className="text-gray-400 text-xs block font-mono">DIÁMETRO BASAL PROM.</span>
              <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block">{stats.avgD} mm</span>
            </div>
          </div>

          <div className="navi-window p-6 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" /> Matriz de Datos Morfológicos ({filteredRecords.length.toLocaleString()} muestras)
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Filter by Block */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-400 shrink-0" />
                  <select 
                    value={selectedBlockFilter}
                    onChange={(e) => { setSelectedBlockFilter(e.target.value); setCurrentPage(1); }}
                    className="text-xs py-2 bg-gray-900 border-gray-700 rounded-md"
                  >
                    <option value="ALL">Todos los Bloques ({records.length.toLocaleString()})</option>
                    {uniqueBlocks.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="relative flex-grow sm:w-64">
                  <input 
                    type="text" 
                    placeholder="Buscar por ID, bloque o nota..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 py-2 text-xs font-mono bg-gray-900 border-gray-700"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            {/* Clean Full-Width Data Table */}
            <div className="overflow-x-auto border border-gray-800 rounded-lg min-h-[400px]">
              <table className="grid-table">
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>Bloque</th>
                    <th>Tratamiento</th>
                    <th>ID Planta</th>
                    <th>Hojas</th>
                    <th>Diámetro Basal</th>
                    <th>Largo / Altura</th>
                    <th>Fecha</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.length > 0 ? (
                    paginatedRecords.map((r) => (
                      <tr key={r.id}>
                        <td className="font-bold text-amber-400 text-xs">#{r.sampleNo}</td>
                        <td className="font-mono text-emerald-400 text-xs font-semibold">{r.blockId || 'General'}</td>
                        <td className="text-gray-300 text-xs">{r.treatment || 'Control'}</td>
                        <td className="font-mono text-sky-300 text-xs">{r.plantId}</td>
                        <td className="font-semibold text-gray-200 text-xs">{r.leaves}</td>
                        <td className="font-semibold text-cyan-300 text-xs">{r.diameter} mm</td>
                        <td className="font-semibold text-emerald-300 text-xs">{r.height} cm</td>
                        <td className="text-gray-400 text-xs font-mono">{r.date}</td>
                        <td>
                          <button 
                            onClick={() => handleDeleteRecord(r.id)} 
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
                      <td colSpan="9" className="text-center py-16 text-gray-400 font-mono text-xs">
                        No hay muestras registradas para mostrar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400 font-mono pt-3 border-t border-gray-800">
                <span>Mostrando {paginatedRecords.length} de {filteredRecords.length.toLocaleString()} muestras (Página {currentPage} de {totalPages})</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn-navi py-1.5 px-3 text-xs disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="btn-navi py-1.5 px-3 text-xs disabled:opacity-40"
                  >
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: GENERADOR MASIVO Y CONFIGURACIÓN DE CAPACIDAD */}
      {activeTab === 'batch' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="navi-window p-8 space-y-6">
            <div className="border-b border-gray-800 pb-4">
              <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                <Target className="w-5 h-5 text-sky-400" /> Capacidad del Sistema y Generación por Lote
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Configura la meta de recolección (hasta 25,000 muestras) y genera datos en lote para pruebas de campo.
              </p>
            </div>

            <div className="space-y-6">
              {/* Capacity Selector */}
              <div className="p-5 bg-gray-900 border border-gray-800 rounded-lg space-y-3">
                <label className="text-gray-200 font-bold block">Capacidad Máxima de Muestras</label>
                <select 
                  value={maxCapacity} 
                  onChange={(e) => setMaxCapacity(Number(e.target.value))}
                  className="w-full text-base font-bold text-emerald-400"
                >
                  <option value={500}>500 Muestras</option>
                  <option value={1000}>1,000 Muestras</option>
                  <option value={5000}>5,000 Muestras</option>
                  <option value={10000}>10,000 Muestras</option>
                  <option value={15000}>15,000 Muestras</option>
                  <option value={20000}>20,000 Muestras</option>
                  <option value={25000}>25,000 Muestras (Capacidad Máxima)</option>
                </select>

                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden mt-3 border border-gray-700">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300" 
                    style={{ width: `${Math.min(Number(progressPct), 100)}%` }} 
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 font-mono pt-1">
                  <span>Muestras Actuales: <strong className="text-emerald-400">{records.length.toLocaleString()}</strong></span>
                  <span>Capacidad: <strong className="text-gray-200">{maxCapacity.toLocaleString()}</strong> ({progressPct}%)</span>
                </div>
              </div>

              {/* Batch Generator */}
              <div className="p-5 bg-gray-900 border border-gray-800 rounded-lg space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block border-b border-gray-800 pb-2">
                  Generador Masivo por Bloques
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 font-medium">Nombre del Bloque o Parcela</label>
                    <input 
                      type="text"
                      value={batchBlockName}
                      onChange={(e) => setBatchBlockName(e.target.value)}
                      placeholder="Ej. Bloque Norte"
                      className="w-full font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-medium">Cantidad de Muestras a Generar</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="25000" 
                      value={batchCount} 
                      onChange={(e) => setBatchCount(e.target.value)}
                      placeholder="500"
                      className="w-full font-bold text-amber-400"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleGenerateBatch} 
                  className="btn-navi btn-navi-green w-full justify-center py-3 text-sm font-bold"
                  disabled={records.length >= maxCapacity}
                >
                  <Zap className="w-5 h-5" /> GENERAR {Number(batchCount).toLocaleString()} MUESTRAS EN LOTE
                </button>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                <span className="text-xs text-gray-400">¿Deseas reiniciar la recolección morfológica?</span>
                <button 
                  onClick={handleClearAll} 
                  className="btn-navi btn-navi-orange text-xs font-bold"
                >
                  <Trash2 className="w-4 h-4" /> Vaciar Todas las Muestras
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
