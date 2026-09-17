import React, { useState, useMemo } from 'react';
import { PlusCircle, Zap, Trash2, Search, BarChart3, ChevronLeft, ChevronRight, Leaf, Target, Layers, Tag, Calendar } from 'lucide-react';

export default function MorphoModule({ records, setRecords }) {
  // Config state - capacity up to 25,000
  const [maxCapacity, setMaxCapacity] = useState(25000);
  const [batchCount, setBatchCount] = useState(500);
  const [batchBlockName, setBatchBlockName] = useState('Bloque A');

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [blockId, setBlockId] = useState('Bloque A');
  const [treatment, setTreatment] = useState('T1 - Biocontrol');
  const [leaves, setLeaves] = useState('');
  const [diameter, setDiameter] = useState('');
  const [length, setLength] = useState('');
  const [plantId, setPlantId] = useState('');
  const [notes, setNotes] = useState('');

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

  // Manual record submission
  const handleAddRecord = (e) => {
    e.preventDefault();
    if (records.length >= maxCapacity) {
      alert(`Has alcanzado la capacidad máxima configurada de ${maxCapacity.toLocaleString()} muestras.`);
      return;
    }
    if (!leaves || !diameter || !length) {
      alert('Por favor completa Número de hojas, Diámetro y Largo/Altura de la planta.');
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

    // Reset fields
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
      alert(`Límite máximo de ${maxCapacity.toLocaleString()} alcanzado.`);
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
    <div className="horizontal-desktop-track window-slide-right">
      {/* WINDOW 1 (Left): Formulario Morfológico */}
      <div className="navi-window w-96 shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" /> REGISTRO_MUESTRA_CAMPO.EXE
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-base font-bold text-gray-100 mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" /> TOMA DE DATOS EN CAMPO Y LAB
          </h2>

          <form onSubmit={handleAddRecord} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-gray-300 font-medium">Fecha *</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-emerald-400 font-medium">Bloque / Parcela *</label>
                <input 
                  type="text" 
                  placeholder="Ej. Bloque 1"
                  value={blockId}
                  onChange={(e) => setBlockId(e.target.value)}
                  className="w-full text-xs font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 font-medium">Tratamiento / Ensayo</label>
              <input 
                type="text" 
                placeholder="Ej. T1 - Bioestimulante"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-amber-400 font-semibold">1. N° Hojas *</label>
                <input 
                  type="number" 
                  placeholder="12"
                  value={leaves}
                  onChange={(e) => setLeaves(e.target.value)}
                  className="w-full font-semibold text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-cyan-400 font-semibold">2. Diámetro (mm) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="5.8"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  className="w-full font-semibold text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-emerald-400 font-semibold">3. Largo (cm) *</label>
                <input 
                  type="number" 
                  step="0.1" 
                  placeholder="42.5"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full font-semibold text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 font-medium">ID Planta / Etiqueta (Opcional)</label>
              <input 
                type="text" 
                placeholder="Ej. PLT-00100"
                value={plantId}
                onChange={(e) => setPlantId(e.target.value)}
                className="w-full font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-gray-400">Observaciones</label>
              <input 
                type="text" 
                placeholder="Ej. Vigor bueno, sin clorosis"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <button 
              type="submit" 
              className="btn-navi btn-navi-green w-full justify-center h-[38px] mt-2 font-bold"
            >
              <PlusCircle className="w-4 h-4" /> REGISTRAR MUESTRA
            </button>
          </form>
        </div>
      </div>

      {/* WINDOW 2 (Middle): Capacidad Máxima (25,000) & Generación por Lotes */}
      <div className="navi-window w-80 shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-sky-400 flex items-center gap-1.5 font-semibold">
            <Target className="w-3.5 h-3.5 text-sky-400" /> CONFIG_CAPACIDAD_LOTES.CFG
          </span>
          <div className="navi-window-controls">
            <div className="navi-win-btn">_</div>
            <div className="navi-win-btn">□</div>
            <div className="navi-win-btn navi-win-btn-close">X</div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-gray-200 font-semibold mb-1 block flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" /> CAPACIDAD MÁXIMA DE MUESTRAS
            </label>
            <select 
              value={maxCapacity} 
              onChange={(e) => setMaxCapacity(Number(e.target.value))}
              className="w-full text-sm font-bold text-emerald-400 mb-2"
            >
              <option value={500}>500 Muestras</option>
              <option value={1000}>1,000 Muestras</option>
              <option value={5000}>5,000 Muestras</option>
              <option value={10000}>10,000 Muestras</option>
              <option value={15000}>15,000 Muestras</option>
              <option value={20000}>20,000 Muestras</option>
              <option value={25000}>25,000 Muestras (Máximo Completo)</option>
            </select>

            <div className="w-full bg-gray-800 rounded h-2 overflow-hidden mb-1 border border-gray-700">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300" 
                style={{ width: `${Math.min(Number(progressPct), 100)}%` }} 
              />
            </div>

            <p className="text-xs text-gray-400 font-mono flex justify-between">
              <span>Progreso:</span>
              <span className="text-emerald-400 font-bold">{records.length.toLocaleString()} / {maxCapacity.toLocaleString()} ({progressPct}%)</span>
            </p>
          </div>

          <div className="pt-3 border-t border-gray-700">
            <label className="text-emerald-400 font-semibold mb-2 block flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> GENERADOR MASIVO POR BLOQUES
            </label>
            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] text-gray-400">Nombre de Bloque / Parcela</label>
                <input 
                  type="text"
                  value={batchBlockName}
                  onChange={(e) => setBatchBlockName(e.target.value)}
                  placeholder="Bloque A"
                  className="w-full text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400">Cantidad de Muestras a Generar</label>
                <input 
                  type="number" 
                  min="1" 
                  max="25000" 
                  value={batchCount} 
                  onChange={(e) => setBatchCount(e.target.value)}
                  placeholder="500"
                  className="w-full text-center font-bold text-xs"
                />
              </div>

              <button 
                onClick={handleGenerateBatch} 
                className="btn-navi btn-navi-green text-xs w-full justify-center font-bold"
                disabled={records.length >= maxCapacity}
              >
                <Zap className="w-4 h-4" /> GENERAR {Number(batchCount).toLocaleString()} MUESTRAS
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

      {/* WINDOW 3 (Right): Matriz de Datos & Filtros de Bloques */}
      <div className="navi-window w-[560px] shrink-0">
        <div className="navi-window-header">
          <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> MATRIZ_DATOS_CAMPO.GRID
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
            <div className="bg-gray-900/90 p-2 border border-gray-700 rounded">
              <span className="text-gray-400 block text-[10px]">TOTAL BLOQUES</span>
              <span className="text-sm font-bold text-sky-400">{stats.blockCount}</span>
            </div>
            <div className="bg-gray-900/90 p-2 border border-gray-700 rounded">
              <span className="text-gray-400 block text-[10px]">HOJAS PROM.</span>
              <span className="text-sm font-bold text-amber-400">{stats.avgL}</span>
            </div>
            <div className="bg-gray-900/90 p-2 border border-gray-700 rounded">
              <span className="text-gray-400 block text-[10px]">DIÁM. (MM)</span>
              <span className="text-sm font-bold text-cyan-400">{stats.avgD}</span>
            </div>
            <div className="bg-gray-900/90 p-2 border border-gray-700 rounded">
              <span className="text-gray-400 block text-[10px]">LARGO (CM)</span>
              <span className="text-sm font-bold text-emerald-400">{stats.avgH}</span>
            </div>
          </div>

          <div className="flex justify-between items-center gap-2">
            {/* Filter by Block */}
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
              <select 
                value={selectedBlockFilter}
                onChange={(e) => { setSelectedBlockFilter(e.target.value); setCurrentPage(1); }}
                className="text-xs py-1 text-gray-200 bg-gray-900 border-gray-700"
              >
                <option value="ALL">Todos los Bloques ({records.length.toLocaleString()})</option>
                {uniqueBlocks.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="relative w-44">
              <input 
                type="text" 
                placeholder="Buscar muestra..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-7 py-1 text-xs font-mono bg-gray-900 border-gray-700"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-2" />
            </div>
          </div>

          {/* Table displaying samples */}
          <div className="overflow-x-auto border border-gray-700 h-[260px] rounded">
            <table className="grid-table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Bloque</th>
                  <th>ID Planta</th>
                  <th>Hojas</th>
                  <th>Diámetro</th>
                  <th>Largo</th>
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
                      <td className="font-mono text-sky-300 text-xs">{r.plantId}</td>
                      <td className="font-semibold text-gray-200 text-xs">{r.leaves}</td>
                      <td className="font-semibold text-cyan-300 text-xs">{r.diameter} mm</td>
                      <td className="font-semibold text-emerald-300 text-xs">{r.height} cm</td>
                      <td className="text-gray-400 text-[11px] font-mono">{r.date}</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteRecord(r.id)} 
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-400 font-mono text-xs">
                      No hay muestras registradas en este bloque.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono pt-1">
              <span>Mostrando {paginatedRecords.length} de {filteredRecords.length.toLocaleString()} muestras (Pág {currentPage}/{totalPages})</span>
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
