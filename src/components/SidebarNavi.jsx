import React from 'react';
import { Sprout, Microscope, CloudRain, ShieldAlert, FileSpreadsheet, Database, HelpCircle, Activity, ChevronRight, Grid, LogOut } from 'lucide-react';

export default function SidebarNavi({ activeTab, setActiveTab, onOpenExport, onOpenSupabase, onOpenGuide, isSupabaseConnected, morphoCount, operatorSession, onLogout }) {
  return (
    <aside className="navi-window w-full md:w-64 shrink-0 flex flex-col justify-between select-none">
      {/* Menu Header */}
      <div className="navi-window-header">
        <span className="font-mono text-xs text-gray-200 flex items-center gap-1.5 font-semibold">
          <Activity className="w-3.5 h-3.5 text-emerald-400" /> Menú de Navegación
        </span>
        <div className="navi-window-controls">
          <div className="navi-win-btn">_</div>
          <div className="navi-win-btn">□</div>
        </div>
      </div>

      <div className="p-4 space-y-5 flex-grow font-sans">
        {/* Operator Badge */}
        {operatorSession && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded text-xs">
            <span className="text-gray-400 block text-[10px] font-mono uppercase">TÉCNICO / OPERADOR:</span>
            <span className="text-emerald-400 font-bold block truncate">{operatorSession.operatorName}</span>
            <span className="text-[10px] text-sky-400 block font-mono">{operatorSession.accessDate}</span>
          </div>
        )}

        {/* Navigation Button */}
        <div>
          <button
            onClick={() => setActiveTab('carousel')}
            className={`w-full text-left p-2.5 rounded text-xs flex items-center justify-between border transition-all ${
              activeTab === 'carousel'
                ? 'bg-emerald-950 text-emerald-400 border-emerald-500 font-bold'
                : 'bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-emerald-400" />
              <span>Vista Panorámica 3D</span>
            </div>
            {activeTab === 'carousel' && <ChevronRight className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* Module Picker Section */}
        <div>
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-semibold border-b border-gray-800 pb-1">
            MÓDULOS PRINCIPALES
          </span>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('morpho')}
              className={`w-full text-left p-2.5 rounded text-xs flex items-center justify-between transition-all ${
                activeTab === 'morpho' 
                  ? 'bg-gray-800 text-emerald-400 border-l-4 border-emerald-400 font-bold shadow' 
                  : 'bg-gray-900/60 text-gray-300 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sprout className={`w-4 h-4 ${activeTab === 'morpho' ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span>Morfología de Planta</span>
              </div>
              {activeTab === 'morpho' && <ChevronRight className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => setActiveTab('fungal')}
              className={`w-full text-left p-2.5 rounded text-xs flex items-center justify-between transition-all ${
                activeTab === 'fungal' 
                  ? 'bg-gray-800 text-emerald-400 border-l-4 border-emerald-400 font-bold shadow' 
                  : 'bg-gray-900/60 text-gray-300 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Microscope className={`w-4 h-4 ${activeTab === 'fungal' ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span>Análisis Fúngico</span>
              </div>
              {activeTab === 'fungal' && <ChevronRight className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => setActiveTab('climate')}
              className={`w-full text-left p-2.5 rounded text-xs flex items-center justify-between transition-all ${
                activeTab === 'climate' 
                  ? 'bg-gray-800 text-emerald-400 border-l-4 border-emerald-400 font-bold shadow' 
                  : 'bg-gray-900/60 text-gray-300 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <CloudRain className={`w-4 h-4 ${activeTab === 'climate' ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span>Datos Climáticos</span>
              </div>
              {activeTab === 'climate' && <ChevronRight className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => setActiveTab('disease')}
              className={`w-full text-left p-2.5 rounded text-xs flex items-center justify-between transition-all ${
                activeTab === 'disease' 
                  ? 'bg-gray-800 text-amber-400 border-l-4 border-amber-400 font-bold shadow' 
                  : 'bg-gray-900/60 text-gray-300 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-4 h-4 ${activeTab === 'disease' ? 'text-amber-400' : 'text-gray-400'}`} />
                <span>Fitosanidad Integral</span>
              </div>
              {activeTab === 'disease' && <ChevronRight className="w-4 h-4 text-amber-400" />}
            </button>
          </nav>
        </div>

        {/* Herramientas */}
        <div>
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-semibold border-b border-gray-800 pb-1">
            HERRAMIENTAS Y ACCIONES
          </span>

          <div className="space-y-1.5">
            <button 
              onClick={onOpenExport} 
              className="btn-navi btn-navi-green text-xs w-full justify-start font-bold"
            >
              <FileSpreadsheet className="w-4 h-4" /> Exportar a Excel (.xlsx)
            </button>

            <button 
              onClick={onOpenSupabase} 
              className="btn-navi btn-navi-yellow text-xs w-full justify-start"
            >
              <Database className="w-4 h-4" /> Base de Datos
            </button>

            <button 
              onClick={onOpenGuide} 
              className="btn-navi text-xs w-full justify-start"
            >
              <HelpCircle className="w-4 h-4" /> Guía de Uso
            </button>

            {onLogout && (
              <button 
                onClick={onLogout} 
                className="btn-navi text-xs w-full justify-start border-rose-500/50 text-rose-400 hover:bg-rose-950"
              >
                <LogOut className="w-4 h-4" /> Cerrar Sesión
              </button>
            )}
          </div>
        </div>

        {/* System Monitor Badge */}
        <div className="bg-gray-950 p-3 border border-gray-800 rounded text-xs font-mono space-y-1">
          <div className="flex justify-between items-center text-gray-400">
            <span>CAPACIDAD:</span>
            <span className="text-emerald-400 font-bold">{morphoCount.toLocaleString()} / 25,000</span>
          </div>
          <div className="flex justify-between items-center text-gray-400">
            <span>ESTADO BD:</span>
            {isSupabaseConnected ? (
              <span className="text-emerald-400 font-bold">SUPABASE</span>
            ) : (
              <span className="text-amber-400 font-bold">LOCALSTORAGE</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-2.5 bg-gray-950 border-t border-gray-800 text-[10px] font-mono text-center text-gray-500">
        AGRONAVI OS V4.0 — EDICIÓN CAMPO
      </div>
    </aside>
  );
}
