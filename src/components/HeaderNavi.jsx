import React, { useState, useEffect } from 'react';
import { Database, FileSpreadsheet, HelpCircle, Activity, Cpu } from 'lucide-react';

export default function HeaderNavi({ activeTab, setActiveTab, onOpenExport, onOpenSupabase, onOpenGuide, isSupabaseConnected, morphoCount }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('es-ES', { hour12: false }) + ' Wired-OS');
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="navi-window max-w-7xl mx-auto mt-4 mb-4">
      {/* Upper Window Header Controls */}
      <div className="navi-window-header">
        <div className="flex items-center gap-2 font-mono text-xs text-purple-300">
          <Cpu className="w-4 h-4 text-green-400 wired-pulse" />
          <span>AGRONAVI_SYSTEM_SHELL_V3.6.exe</span>
        </div>
        <div className="navi-window-controls">
          <div className="navi-win-btn" title="Minimizar">_</div>
          <div className="navi-win-btn" title="Maximizar">□</div>
          <div className="navi-win-btn navi-win-btn-close" title="Cerrar">X</div>
        </div>
      </div>

      <div className="p-4 bg-[#140828]/95">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand & Title Window */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-purple-900/60 border border-green-400 flex items-center justify-center navi-border-green">
              <Cpu className="w-7 h-7 text-green-400 wired-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-yellow-400 tracking-wider">
                  AGRONAVI // CYBERIA
                </h1>
                <span className="text-xs bg-purple-900 text-green-300 border border-green-500 px-2 py-0.5">
                  V3.6 NAVI
                </span>
              </div>
              <p className="text-xs text-purple-300 font-mono">
                [SYSTEM_STATUS: ONLINE] // RECOLECCIÓN AGRONÓMICA & FITOSANITARIA
              </p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-4 text-xs font-mono bg-purple-950/80 p-2.5 border border-purple-700 rounded">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">MUESTRAS:</span>
              <span className="text-yellow-400 font-bold">{morphoCount}</span>
            </div>
            <div className="h-4 w-px bg-purple-700" />
            <div className="flex items-center gap-1.5">
              <span className="text-purple-300">BD:</span>
              {isSupabaseConnected ? (
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span> SUPABASE
                </span>
              ) : (
                <span className="text-orange-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"></span> LOCALSTORAGE
                </span>
              )}
            </div>
            <div className="h-4 w-px bg-purple-700 hidden sm:block" />
            <div className="text-cyan-400 font-bold hidden sm:block">
              {time}
            </div>
          </div>

          {/* Top Action Buttons (Green, Gold, Orange) */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenExport} 
              className="btn-navi btn-navi-green text-xs"
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
              className="btn-navi btn-navi-orange text-xs"
              title="Guía de ayuda y despliegue"
            >
              <HelpCircle className="w-4 h-4" /> GUÍA APPS
            </button>
          </div>
        </div>

        {/* Module Navigation Tabs */}
        <div className="mt-4 pt-3 border-t border-purple-800/60 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('morpho')}
            className={`btn-navi text-sm ${activeTab === 'morpho' ? 'bg-purple-700 text-white border-green-400 shadow-lg' : 'opacity-80'}`}
          >
            🌱 PARÁMETROS MORFOLÓGICOS
          </button>

          <button
            onClick={() => setActiveTab('fungal')}
            className={`btn-navi text-sm ${activeTab === 'fungal' ? 'bg-purple-700 text-white border-green-400 shadow-lg' : 'opacity-80'}`}
          >
            🍄 MICORRIZAS Y TRICHODERMA (%)
          </button>

          <button
            onClick={() => setActiveTab('climate')}
            className={`btn-navi text-sm ${activeTab === 'climate' ? 'bg-purple-700 text-white border-green-400 shadow-lg' : 'opacity-80'}`}
          >
            🌧️ CLIMA Y ENFERMEDADES FOLIARES
          </button>
        </div>
      </div>
    </header>
  );
}
