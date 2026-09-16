import React from 'react';
import { FileSpreadsheet, X, CheckCircle, Download, Table, Database, Calendar } from 'lucide-react';
import { exportAgroNaviToExcel } from '../lib/excelExporter';

export default function ExcelExportModal({ isOpen, onClose, morphoRecords, fungalRecords, climateRecords }) {
  if (!isOpen) return null;

  const handleDownload = () => {
    exportAgroNaviToExcel(morphoRecords, fungalRecords, climateRecords);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="navi-card w-full max-w-lg p-6 rounded border-2 border-green-400 navi-border-green relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-purple-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-purple-800 pb-3 mb-4">
          <div className="w-10 h-10 rounded bg-green-950 border border-green-400 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-yellow-400">EXPORTAR A EXCEL ORDENADO</h2>
            <p className="text-xs text-purple-300">Generador de libro .XLSX con pestañas estructuradas</p>
          </div>
        </div>

        <div className="space-y-3 mb-6 text-sm">
          <p className="text-gray-300">
            El archivo exportado contendrá <strong>4 pestañas ordenadas</strong> listas para informes o análisis estadístico:
          </p>

          <div className="bg-purple-950/80 p-3 rounded border border-purple-700 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center text-yellow-300">
              <span className="flex items-center gap-1.5"><Table className="w-3.5 h-3.5" /> 1. Resumen_Ejecutivo</span>
              <span className="text-green-400 font-bold">Metadatos & Promedios</span>
            </div>
            <div className="flex justify-between items-center text-cyan-300">
              <span className="flex items-center gap-1.5"><Table className="w-3.5 h-3.5" /> 2. Datos_Morfológicos</span>
              <span className="font-bold">{morphoRecords.length} muestras</span>
            </div>
            <div className="flex justify-between items-center text-purple-300">
              <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> 3. Colonización_Fúngica</span>
              <span className="font-bold">{fungalRecords.length} evaluaciones</span>
            </div>
            <div className="flex justify-between items-center text-orange-300">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> 4. Clima_y_Fitosanidad</span>
              <span className="font-bold">{climateRecords.length} registros</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-green-400">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Formato limpio, encabezados legibles y columnas auto-ajustadas.</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-purple-800">
          <button onClick={onClose} className="btn-navi btn-navi-orange text-xs">
            CANCELAR
          </button>
          <button onClick={handleDownload} className="btn-navi btn-navi-green text-xs font-bold">
            <Download className="w-4 h-4" /> DESCARGAR LIBRO EXCEL (.XLSX)
          </button>
        </div>
      </div>
    </div>
  );
}
