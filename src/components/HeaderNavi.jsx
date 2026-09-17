import React, { useState, useEffect } from 'react';
import { Database, FileSpreadsheet, HelpCircle, Activity, Cpu } from 'lucide-react';

export default function HeaderNavi({ onOpenExport, onOpenSupabase, onOpenGuide, isSupabaseConnected, morphoCount }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('es-ES', { hour12: false }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="navi-window max-w-7xl mx-auto mt-4 mb-4">
      {/* Upper Window Header Controls */}
      <div className="navi-window-header">
        <div className="flex items-center gap-2 font-mono text-xs text-gray-300">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>AGRONAVI_FIELD_OS_V4.0.exe</span>
        </div>
        <div className="navi-window-controls">
          <div className="navi-win-btn" title="Minimizar">_</div>
          <div className="navi-win-btn" title="Maximizar">□</div>
          <div className="navi-win-btn navi-win-btn-close" title="Cerrar">X</div>
        </div>
      </div>

      <div className="p-4 bg-gray-900/95">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand & Title Window */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded bg-gray-800 border border-emerald-400 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-100 tracking-wide">
                  AGRONAVI OS
                </h1>
                <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 font-mono rounded">
                  25K FIELD & LAB
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                SISTEMA INTEGRAL DE RECOLECCIÓN AGRONÓMICA Y FITOSANITARIA
              </p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-4 text-xs font-mono bg-gray-950 p-2.5 border border-gray-800 rounded">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-400">MUESTRAS:</span>
              <span className="text-emerald-400 font-bold">{morphoCount.toLocaleString()} / 25,000</span>
            </div>
            <div className="h-4 w-px bg-gray-800" />
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">BD:</span>
              {isSupabaseConnected ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> SUPABASE
                </span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> LOCALSTORAGE
                </span>
              )}
            </div>
            <div className="h-4 w-px bg-gray-800 hidden sm:block" />
            <div className="text-sky-400 font-bold hidden sm:block">
              {time}
            </div>
          </div>

          {/* Quick Bar Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenExport} 
              className="btn-navi btn-navi-green text-xs font-bold"
              title="Exportar archivo Excel estructurado"
            >
              <FileSpreadsheet className="w-4 h-4" /> EXCEL (.XLSX)
            </button>

            <button 
              onClick={onOpenSupabase} 
              className="btn-navi btn-navi-yellow text-xs"
              title="Configurar Supabase"
            >
              <Database className="w-4 h-4" /> BASE DE DATOS
            </button>

            <button 
              onClick={onOpenGuide} 
              className="btn-navi text-xs"
              title="Guía de ayuda y despliegue"
            >
              <HelpCircle className="w-4 h-4" /> GUÍA APPS
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
