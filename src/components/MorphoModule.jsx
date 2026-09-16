import React, { useState, useMemo } from 'react';
import { PlusCircle, Zap, Trash2, Search, BarChart3, ChevronLeft, ChevronRight, Leaf, Target } from 'lucide-react';

export default function MorphoModule({ records, setRecords }) {
  // Config state
  const [maxCapacity, setMaxCapacity] = useState(1000);
  const [batchCount, setBatchCount] = useState(100);

  // Form State: 3 specific fields requested
  const [leaves, setLeaves] = useState('');
  const [diameter, setDiameter] = useState('');
  const [length, setLength] = useState('');
  const [plantId, setPlantId] = useState('');
  const [notes, setNotes] = useState('');

  // Pagination & Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Manual record submission
  const handleAddRecord = (e) => {
    e.preventDefault();
    if (records.length >= maxCapacity) {
      alert(`Has alcanzado el límite máximo configurado de ${maxCapacity} muestras.`);
      return;
    }
    if (!leaves || !diameter || !length) {
      alert('Por favor completa Número de hojas, Diámetro de la planta y Largo de la planta.');
      return;
    }

    const nextNo = records.length + 1;
    const newRec = {
      id: `m-${Date.now()}-${Math.random()}`,
      sampleNo: nextNo,
      plantId: plantId || `PLT-${String(nextNo).padStart(4, '0')}`,
      leaves: parseInt(leaves, 10),
      diameter: parseFloat(diameter).toFixed(2),
      height: parseFloat(length).toFixed(1),
      date: new Date().toISOString().split('T')[0],
      notes: notes || 'Entrada manual'
    };

    setRecords([newRec, ...records]);

    // Reset form
    setLeaves('');
    setDiameter('');
    setLength('');
    setPlantId('');
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
        leaves: Math.floor(6 + Math.random() * 12),
        diameter: (2.5 + Math.random() * 6).toFixed(2),
        height: (20 + Math.random() * 45).toFixed(1),
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
    if (records.length === 0) return { avgH: '0.0', avgD: '0.00', avgL: '0.0' };
    const heights = records.map(r => Number(r.height));
    const diameters = records.map(r => Number(r.diameter));
    const leavesList = records.map(r => Number(r.leaves));

    const sumH = heights.reduce((a, b) => a + b, 0);
    const sumD = diameters.reduce((a, b) => a + b, 0);
    const sumL = leavesList.reduce((a, b) => a + b, 0);

    return {
      avgH: (sumH / records.length).toFixed(1),
      avgD: (sumD / records.length).toFixed(2),
      avgL: (sumL / records.length).toFixed(1)
    };
  }, [records]);

  const progressPct = maxCapacity > 0 ? ((records.length / maxCapacity) * 100).toFixed(1) : '0.0';

  return (
    <div className="horizontal-desktop-track window-slide-right">
      {/* WINDOW 1 (Left): Formulario Morfológico */}
      <div className="navi-window w-96 shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-yellow-400 flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5 text-green-400" /> MORPHO_INPUT_FORM.EXE
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-lg font-bold text-yellow-400 mb-4 border-b border-purple-800 pb-2 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-400" /> REGISTRO DE PLANTA
          </h2>

          <form onSubmit={handleAddRecord} className="space-y-4 text-sm">
            <div>
              <label className="text-orange-400 font-bold">1. Número de hojas *</label>
              <input 
                type="number" 
                placeholder="Ej. 12"
                value={leaves}
                onChange={(e) => setLeaves(e.target.value)}
                className="w-full font-bold"
                required
              />
            </div>

            <div>
              <label className="text-yellow-400 font-bold">2. Diámetro de la planta (cm) *</label>
              <input 
                type="number" 
                step="0.01" 
                placeholder="Ej. 5.8"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
                className="w-full font-bold"
                required
              />
            </div>

            <div>
              <label className="text-green-400 font-bold">3. Largo de la planta (cm) *</label>
              <input 
                type="number" 
                step="0.1" 
                placeholder="Ej. 42.5"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full font-bold"
                required
              />
            </div>

            <div>
              <label>ID Planta (Opcional)</label>
              <input 
                type="text" 
                placeholder="Ej. PLT-0016"
                value={plantId}
                onChange={(e) => setPlantId(e.target.value)}
                className="w-full font-mono text-xs"
              />
            </div>

            <button 
              type="submit" 
              className="btn-navi btn-navi-green w-full justify-center h-[42px] mt-2"
            >
              <PlusCircle className="w-4 h-4" /> REGISTRAR MUESTRA
            </button>
          </form>
        </div>
      </div>

      {/* WINDOW 2 (Middle): Capacidad Máxima & Lotes */}
      <div className="navi-window w-80 shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-green-400 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-yellow-400" /> SYSTEM_CAPACITY.CFG
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-4 space-y-5">
          <div>
            <label className="text-yellow-400 font-bold mb-1 block flex items-center gap-1.5">
              <Target className="w-4 h-4 text-green-400" /> CAPACIDAD MÁXIMA MUESTRAS
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
              <option value={9000}>9,000 Muestras (Máximo)</option>
            </select>
            <p className="text-xs text-purple-300 font-mono">
              Progreso: <span className="text-yellow-300 font-bold">{records.length}</span> / <span className="text-green-400 font-bold">{maxCapacity}</span> ({progressPct}%)
            </p>
          </div>

          <div className="pt-4 border-t border-purple-800">
            <label className="text-green-400 font-bold mb-2 block flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" /> GENERADOR DE LOTE
            </label>
            <div className="space-y-3">
              <input 
                type="number" 
                min="1" 
                max="9000" 
                value={batchCount} 
                onChange={(e) => setBatchCount(e.target.value)}
                placeholder="100"
                className="w-full text-center font-bold"
              />
              <button 
                onClick={handleGenerateBatch} 
                className="btn-navi btn-navi-green text-xs w-full justify-center"
                disabled={records.length >= maxCapacity}
              >
                <Zap className="w-4 h-4" /> GENERAR {batchCount} MUESTRAS
              </button>
              <button 
                onClick={handleClearAll} 
                className="btn-navi btn-navi-orange text-xs w-full justify-center"
              >
                <Trash2 className="w-4 h-4" /> VACIAR REGISTROS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WINDOW 3 (Right): Matriz de Datos Morfológicos & Estadísticas */}
      <div className="navi-window w-[540px] shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-cyan-400 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-yellow-400" /> MORPHO_DATA_MATRIX.GRID
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Summary Stats Cards */}
          <div className="grid grid-cols-4 gap-2 font-mono text-center text-xs">
            <div className="bg-purple-950/80 p-2 border border-purple-700 rounded">
              <span className="text-purple-300 block text-[10px]">HOJAS PROM.</span>
              <span className="text-sm font-bold text-orange-400">{stats.avgL}</span>
            </div>
            <div className="bg-purple-950/80 p-2 border border-purple-700 rounded">
              <span className="text-purple-300 block text-[10px]">DIÁM. (CM)</span>
              <span className="text-sm font-bold text-yellow-400">{stats.avgD}</span>
            </div>
            <div className="bg-purple-950/80 p-2 border border-purple-700 rounded">
              <span className="text-purple-300 block text-[10px]">LARGO (CM)</span>
              <span className="text-sm font-bold text-green-400">{stats.avgH}</span>
            </div>
            <div className="bg-purple-950/80 p-2 border border-purple-700 rounded">
              <span className="text-purple-300 block text-[10px]">TOTAL</span>
              <span className="text-sm font-bold text-cyan-400">{records.length}</span>
            </div>
          </div>

          <div className="flex justify-between items-center gap-2">
            <h3 className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-green-400" /> REGISTROS MORFOLÓGICOS
            </h3>
            <div className="relative w-44">
              <input 
                type="text" 
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-7 py-0.5 text-xs font-mono"
              />
              <Search className="w-3.5 h-3.5 text-purple-400 absolute left-2 top-1.5" />
            </div>
          </div>

          <div className="overflow-x-auto border border-purple-800 h-[220px]">
            <table className="grid-table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>ID Planta</th>
                  <th>N° Hojas</th>
                  <th>Diámetro (cm)</th>
                  <th>Largo (cm)</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.length > 0 ? (
                  paginatedRecords.map((r) => (
                    <tr key={r.id}>
                      <td className="font-bold text-yellow-300 text-xs">#{r.sampleNo}</td>
                      <td className="font-mono text-cyan-300 text-xs">{r.plantId}</td>
                      <td className="font-bold text-orange-400 text-xs">{r.leaves}</td>
                      <td className="font-bold text-yellow-400 text-xs">{r.diameter}</td>
                      <td className="font-bold text-green-400 text-xs">{r.height}</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteRecord(r.id)} 
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-purple-300 font-mono text-xs">
                      No hay muestras registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center text-[11px] text-purple-300 font-mono pt-1">
              <span>Pág {currentPage}/{totalPages}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-navi py-0.5 px-2 text-[10px] disabled:opacity-40"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-navi py-0.5 px-2 text-[10px] disabled:opacity-40"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
