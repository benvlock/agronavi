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
      <div className="navi-window w-full max-w-lg p-6 rounded border border-emerald-500 relative bg-[#111827]">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-gray-700 pb-3 mb-4">
          <div className="w-10 h-10 rounded bg-emerald-950 border border-emerald-400 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-100">EXPORTAR A EXCEL (.XLSX)</h2>
            <p className="text-xs text-gray-400">Generador de libro Excel estructurado para análisis de datos</p>
          </div>
        </div>

        <div className="space-y-3 mb-6 text-xs">
          <p className="text-gray-300">
            El archivo exportado contendrá <strong>4 pestañas ordenadas</strong> con encabezados claros y datos estructurados:
          </p>

          <div className="bg-gray-900 p-3 rounded border border-gray-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center text-amber-400">
              <span className="flex items-center gap-1.5"><Table className="w-3.5 h-3.5" /> 1. Resumen_Ejecutivo</span>
              <span className="text-emerald-400 font-bold">Metadatos & Promedios</span>
            </div>
            <div className="flex justify-between items-center text-emerald-400">
              <span className="flex items-center gap-1.5"><Table className="w-3.5 h-3.5" /> 2. Datos_Morfológicos</span>
              <span className="font-bold">{morphoRecords.length.toLocaleString()} muestras</span>
            </div>
            <div className="flex justify-between items-center text-sky-400">
              <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> 3. Colonización_Fúngica</span>
              <span className="font-bold">{fungalRecords.length.toLocaleString()} evaluaciones</span>
            </div>
            <div className="flex justify-between items-center text-rose-400">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> 4. Clima_y_Fitosanidad</span>
              <span className="font-bold">{climateRecords.length.toLocaleString()} registros</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Formato limpio, auto-ajuste de columnas y compatibilidad total con Excel/Google Sheets.</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-700">
          <button onClick={onClose} className="btn-navi text-xs">
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
