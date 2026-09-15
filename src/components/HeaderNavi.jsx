import React, { useState, useEffect } from 'react';
import { Database, FileSpreadsheet, HelpCircle, Shield, Cpu, Activity } from 'lucide-react';

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
    <header style={{ background: '#130924', borderBottom: '2px solid var(--purple-neon)' }} className="p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand & Navi Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-purple-900/60 border border-green-400 flex items-center justify-center navi-border-green">
            <Cpu className="w-6 h-6 text-green-400 wired-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-yellow-400 tracking-wider">AGRONAVI // CYBERIA</h1>
              <span className="text-xs bg-purple-900 text-green-300 border border-green-500 px-2 py-0.5">
                v3.6 NAVI
              </span>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              [SYSTEM_STATUS: ONLINE] // RECOLECCIÓN AGRONÓMICA & FITOSANITARIA
            </p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-4 text-xs font-mono bg-purple-950/70 p-2 border border-purple-700">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">MUESTRAS:</span>
            <span className="text-yellow-400 font-bold">{morphoCount} / 9000</span>
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
          <div className="text-cyan-400 hidden sm:block">
            {time}
          </div>
        </div>

        {/* Quick Actions */}
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

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-purple-800/60 flex flex-wrap gap-2">
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
    </header>
  );
}
