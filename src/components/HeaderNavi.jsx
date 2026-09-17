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
      {/* Header Bar */}
      <div className="navi-window-header">
        <div className="flex items-center gap-2 font-mono text-xs text-gray-300 font-medium">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>AGRONAVI OS — Plataforma Agronómica Integrada</span>
        </div>
        <div className="navi-window-controls">
          <div className="navi-win-btn" title="Minimizar">_</div>
          <div className="navi-win-btn" title="Maximizar">□</div>
          <div className="navi-win-btn navi-win-btn-close" title="Cerrar">X</div>
        </div>
      </div>

      <div className="p-4 bg-gray-900/95">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded bg-gray-800 border border-emerald-400 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-100 tracking-wide">
                  AGRONAVI OS
                </h1>
                <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded font-mono">
                  Capacidad: 25,000 Muestras
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Sistema de Recolección Agronómica y Fitosanitaria para Campo y Laboratorio
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
              <span className="text-gray-400">BASE DE DATOS:</span>
              {isSupabaseConnected ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> SUPABASE
                </span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> ALMACENAMIENTO LOCAL
                </span>
              )}
            </div>
            <div className="h-4 w-px bg-gray-800 hidden sm:block" />
            <div className="text-sky-400 font-bold hidden sm:block">
              {time}
            </div>
          </div>

          {/* Quick Buttons Menu */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenExport} 
              className="btn-navi btn-navi-green text-xs font-bold"
              title="Exportar archivo Excel estructurado"
            >
              <FileSpreadsheet className="w-4 h-4" /> Exportar Excel (.xlsx)
            </button>

            <button 
              onClick={onOpenSupabase} 
              className="btn-navi btn-navi-yellow text-xs"
              title="Configurar Supabase"
            >
              <Database className="w-4 h-4" /> Base de Datos
            </button>

            <button 
              onClick={onOpenGuide} 
              className="btn-navi text-xs"
              title="Guía de uso y despliegue"
            >
              <HelpCircle className="w-4 h-4" /> Guía
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
