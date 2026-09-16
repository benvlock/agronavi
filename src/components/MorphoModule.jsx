import React, { useState, useMemo } from 'react';
import { PlusCircle, Zap, Trash2, Search, BarChart3, ChevronLeft, ChevronRight, Leaf, Target } from 'lucide-react';

export default function MorphoModule({ records, setRecords }) {
  // Config state
  const [maxCapacity, setMaxCapacity] = useState(1000);
  const [batchCount, setBatchCount] = useState(100);

  // New Record Form State
  const [plantId, setPlantId] = useState('');
  const [height, setHeight] = useState('');
  const [diameter, setDiameter] = useState('');
  const [leaves, setLeaves] = useState('');
  const [notes, setNotes] = useState('');

  // Pagination & Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Manual record submission
  const handleAddRecord = (e) => {
    e.preventDefault();
    if (records.length >= maxCapacity) {
      alert(`Has alcanzado el límite máximo configurado de ${maxCapacity} muestras.`);
      return;
    }
    if (!height || !diameter || !leaves) {
      alert('Por favor completa Altura, Diámetro y Número de Hojas.');
      return;
    }

    const nextNo = records.length + 1;
    const newRec = {
      id: `m-${Date.now()}-${Math.random()}`,
      sampleNo: nextNo,
      plantId: plantId || `PLT-${String(nextNo).padStart(4, '0')}`,
      height: parseFloat(height).toFixed(1),
      diameter: parseFloat(diameter).toFixed(2),
      leaves: parseInt(leaves, 10),
      date: new Date().toISOString().split('T')[0],
      notes: notes || 'Entrada manual'
    };

    setRecords([newRec, ...records]);

    // Reset form
    setPlantId('');
    setHeight('');
    setDiameter('');
    setLeaves('');
    setNotes('');
  };

  // Quick Batch Generator
  const handleGenerateBatch = () => {
    const count = Math.min(Number(batchCount), maxCapacity - records.length);
    if (count <= 0) {
      alert(`Límite de ${maxCapacity} alcanzado.`);
      return;
    }

    const newBatch = [];
    const baseNo = records.length;
    for (let i = 0; i < count; i++) {
      const idx = baseNo + i + 1;
      newBatch.push({
        id: `m-batch-${Date.now()}-${i}`,
        sampleNo: idx,
        plantId: `PLT-${String(idx).padStart(4, '0')}`,
        height: (20 + Math.random() * 45).toFixed(1),
        diameter: (2.5 + Math.random() * 6).toFixed(2),
        leaves: Math.floor(6 + Math.random() * 12),
        date: new Date().toISOString().split('T')[0],
        notes: 'Generación por Lote de Campo'
      });
    }

    setRecords([...records, ...newBatch]);
  };

  // Delete individual record
  const handleDeleteRecord = (id) => {
    setRecords(records.filter(r => r.id !== id));
  };

  // Clear all records
  const handleClearAll = () => {
    if (window.confirm('¿Seguro que deseas borrar todos los registros morfológicos?')) {
      setRecords([]);
      setCurrentPage(1);
    }
  };

  // Filter & Pagination Calculations
  const filteredRecords = useMemo(() => {
    if (!searchTerm) return records;
    const term = searchTerm.toLowerCase();
    return records.filter(r => 
      r.plantId?.toLowerCase().includes(term) || 
      String(r.sampleNo).includes(term) ||
      r.notes?.toLowerCase().includes(term)
    );
  }, [records, searchTerm]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  // Statistical summary
  const stats = useMemo(() => {
    if (records.length === 0) return { avgH: '0.0', avgD: '0.00', avgL: '0.0', minH: '0.0', maxH: '0.0' };
    const heights = records.map(r => Number(r.height));
    const diameters = records.map(r => Number(r.diameter));
    const leavesList = records.map(r => Number(r.leaves));

    const sumH = heights.reduce((a, b) => a + b, 0);
    const sumD = diameters.reduce((a, b) => a + b, 0);
    const sumL = leavesList.reduce((a, b) => a + b, 0);

    return {
      avgH: (sumH / records.length).toFixed(1),
      avgD: (sumD / records.length).toFixed(2),
      avgL: (sumL / records.length).toFixed(1),
      minH: Math.min(...heights).toFixed(1),
      maxH: Math.max(...heights).toFixed(1)
    };
  }, [records]);

  const progressPct = maxCapacity > 0 ? ((records.length / maxCapacity) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6 window-slide-right">
      {/* Upper Panel Window Stack: Capacity & Batch Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Window 1: Capacidad Máxima */}
        <div className="navi-window">
          <div className="navi-window-header">
            <span className="font-mono text-xs text-yellow-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-green-400" /> CAPACITY_SETTINGS.SYS
            </span>
            <div className="navi-window-controls">
              <div className="navi-win-btn">_</div>
              <div className="navi-win-btn">□</div>
              <div className="navi-win-btn navi-win-btn-close">X</div>
            </div>
          </div>
          <div className="p-4">
            <label className="text-yellow-400 font-bold mb-1 block flex items-center gap-1.5">
              <Target className="w-4 h-4 text-green-400" /> CAPACIDAD MÁXIMA DE MUESTRAS
            </label>
            <select 
              value={maxCapacity} 
              onChange={(e) => setMaxCapacity(Number(e.target.value))}
              className="w-full text-base font-bold text-green-400 mb-2"
            >
              <option value={100}>100 Muestras</option>
              <option value={500}>500 Muestras</option>
              <option value={1000}>1,000 Muestras</option>
              <option value={3000}>3,000 Muestras</option>
              <option value={5000}>5,000 Muestras</option>
              <option value={9000}>9,000 Muestras (Máximo Agronómico)</option>
            </select>
            <p className="text-xs text-purple-300 font-mono">
              Progreso: <span className="text-yellow-300 font-bold">{records.length}</span> de <span className="text-green-400 font-bold">{maxCapacity}</span> capturadas ({progressPct}%)
            </p>
          </div>
        </div>

        {/* Window 2: Entrada Rápida de Muestras */}
        <div className="navi-window lg:col-span-2">
          <div className="navi-window-header">
            <span className="font-mono text-xs text-green-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" /> BATCH_GENERATOR_MATRIX.DAT
            </span>
            <div className="navi-window-controls">
              <div className="navi-win-btn">_</div>
              <div className="navi-win-btn">□</div>
              <div className="navi-win-btn navi-win-btn-close">X</div>
            </div>
          </div>
          <div className="p-4">
            <label className="text-green-400 font-bold mb-2 block flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" /> ENTRADA RÁPIDA DE MUESTRAS POR LOTE
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <input 
                type="number" 
                min="1" 
                max="9000" 
                value={batchCount} 
                onChange={(e) => setBatchCount(e.target.value)}
                placeholder="100"
                className="w-28 text-center font-bold"
              />
              <button 
                onClick={handleGenerateBatch} 
                className="btn-navi btn-navi-green text-sm"
                disabled={records.length >= maxCapacity}
              >
                <Zap className="w-4 h-4" /> GENERAR {batchCount} REGISTROS
              </button>
              <button 
                onClick={handleClearAll} 
                className="btn-navi btn-navi-orange text-sm ml-auto"
              >
                <Trash2 className="w-4 h-4" /> VACIAR TABLA
              </button>
            </div>
            <p className="text-xs text-purple-300 mt-2 font-mono">
              Generador automático por lote para pruebas de rendimiento y exportación a Excel.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Lower Window: Form Input Window */}
      <div className="navi-window">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-yellow-400 flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5 text-green-400" /> FORM_NEW_MORPHO_ENTRY.EXE
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-xl font-bold text-yellow-400 mb-4 border-b border-purple-800 pb-2 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-400" /> REGISTRAR NUEVA MUESTRA MORFOLÓGICA
          </h2>

          <form onSubmit={handleAddRecord} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label>ID Planta / Código: PLT-0016</label>
              <input 
                type="text" 
                placeholder="PLT-0016"
                value={plantId}
                onChange={(e) => setPlantId(e.target.value)}
                className="w-full font-mono"
              />
            </div>

            <div>
              <label className="text-green-400 font-bold">Altura Planta (cm) * Ej. 42.5</label>
              <input 
                type="number" 
                step="0.1" 
                placeholder="Ej. 42.5"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full font-bold"
                required
              />
            </div>

            <div>
              <label className="text-yellow-400 font-bold">Diámetro Basal (mm) * Ej. 5.80</label>
              <input 
                type="number" 
                step="0.01" 
                placeholder="Ej. 5.80"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
                className="w-full font-bold"
                required
              />
            </div>

            <div>
              <label className="text-orange-400 font-bold">Número de Hojas * Ej. 12</label>
              <input 
                type="number" 
                placeholder="Ej. 12"
                value={leaves}
                onChange={(e) => setLeaves(e.target.value)}
                className="w-full font-bold"
                required
              />
            </div>

            <div className="sm:col-span-2 md:col-span-1 flex items-end">
              <button 
                type="submit" 
                className="btn-navi btn-navi-green w-full justify-center h-[40px]"
              >
                <PlusCircle className="w-4 h-4" /> GUARDAR DATO
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Summary Statistics Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-purple-950/80 p-3 border border-purple-700 rounded text-center">
          <span className="text-xs text-purple-300 block font-mono">ALTURA PROMEDIO</span>
          <span className="text-xl font-bold text-green-400">{stats.avgH} cm</span>
          <span className="text-[10px] text-gray-400 block font-mono">Min: {stats.minH} / Máx: {stats.maxH}</span>
        </div>

        <div className="bg-purple-950/80 p-3 border border-purple-700 rounded text-center">
          <span className="text-xs text-purple-300 block font-mono">DIÁMETRO BASAL PROM.</span>
          <span className="text-xl font-bold text-yellow-400">{stats.avgD} mm</span>
        </div>

        <div className="bg-purple-950/80 p-3 border border-purple-700 rounded text-center">
          <span className="text-xs text-purple-300 block font-mono">HOJAS PROMEDIO</span>
          <span className="text-xl font-bold text-orange-400">{stats.avgL} hojas</span>
        </div>

        <div className="bg-purple-950/80 p-3 border border-purple-700 rounded text-center">
          <span className="text-xs text-purple-300 block font-mono">TOTAL MUESTRAS</span>
          <span className="text-xl font-bold text-cyan-400">{records.length}</span>
        </div>
      </div>

      {/* Matrix Table Window */}
      <div className="navi-window">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-cyan-400 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-yellow-400" /> DATA_MATRIX_VIEW.GRID
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <h3 className="text-md font-bold text-yellow-400 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-400" /> MATRIZ DE PARÁMETROS MORFOLÓGICOS ({records.length})
            </h3>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="Buscar por ID o nota..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-8 py-1 text-sm"
                />
                <Search className="w-4 h-4 text-purple-400 absolute left-2 top-2" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-purple-800">
            <table className="grid-table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>ID Planta</th>
                  <th>Altura (cm)</th>
                  <th>Diámetro Basal (mm)</th>
                  <th>N° Hojas</th>
                  <th>Fecha</th>
                  <th>Notas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.length > 0 ? (
                  paginatedRecords.map((r) => (
                    <tr key={r.id}>
                      <td className="font-bold text-yellow-300">#{r.sampleNo}</td>
                      <td className="font-mono text-cyan-300">{r.plantId}</td>
                      <td className="font-bold text-green-400">{r.height} cm</td>
                      <td className="font-bold text-yellow-400">{r.diameter} mm</td>
                      <td className="font-bold text-orange-400">{r.leaves}</td>
                      <td className="text-gray-300 text-xs">{r.date}</td>
                      <td className="text-gray-400 text-xs max-w-xs truncate">{r.notes}</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteRecord(r.id)} 
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-purple-300 font-mono">
                      No hay muestras registradas en el sistema.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 pt-2 border-t border-purple-800 text-xs text-purple-300 font-mono">
              <div>
                Página <span className="text-yellow-400 font-bold">{currentPage}</span> de <span className="text-green-400 font-bold">{totalPages}</span> (Mostrando {paginatedRecords.length} de {filteredRecords.length})
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-navi py-1 px-3 text-xs disabled:opacity-40"
                >
                  <ChevronLeft className="w-3 h-3" /> ANTERIOR
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-navi py-1 px-3 text-xs disabled:opacity-40"
                >
                  SIGUIENTE <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
