import React from 'react';
import { Sprout, Microscope, CloudRain, FileSpreadsheet, Database, HelpCircle, Activity, ChevronRight } from 'lucide-react';

export default function SidebarNavi({ activeTab, setActiveTab, onOpenExport, onOpenSupabase, onOpenGuide, isSupabaseConnected, morphoCount }) {
  return (
    <aside className="navi-window w-full md:w-64 shrink-0 flex flex-col justify-between">
      {/* Window Header */}
      <div className="navi-window-header">
        <span className="font-mono text-xs text-yellow-300 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-green-400 wired-pulse" /> NAVI_NAVIGATION.SYS
        </span>
        <div className="navi-window-controls">
          <div className="navi-win-btn">_</div>
          <div className="navi-win-btn">□</div>
        </div>
      </div>

      <div className="p-4 space-y-6 flex-grow">
        {/* Module Picker Section */}
        <div>
          <span className="text-[11px] font-mono text-purple-300 uppercase tracking-wider block mb-2 font-bold border-b border-purple-800 pb-1">
            [ SELECCIONADOR DE MÓDULO ]
          </span>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('morpho')}
              className={`w-full text-left p-3 rounded font-serif text-sm flex items-center justify-between transition-all ${
                activeTab === 'morpho' 
                  ? 'bg-purple-800/90 text-yellow-300 border-l-4 border-green-400 font-bold shadow-md' 
                  : 'bg-purple-950/40 text-purple-200 hover:bg-purple-900/60 border border-purple-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sprout className={`w-4 h-4 ${activeTab === 'morpho' ? 'text-green-400' : 'text-purple-400'}`} />
                <span>PARÁMETROS MORFOLÓGICOS</span>
              </div>
              {activeTab === 'morpho' && <ChevronRight className="w-4 h-4 text-green-400" />}
            </button>

            <button
              onClick={() => setActiveTab('fungal')}
              className={`w-full text-left p-3 rounded font-serif text-sm flex items-center justify-between transition-all ${
                activeTab === 'fungal' 
                  ? 'bg-purple-800/90 text-yellow-300 border-l-4 border-green-400 font-bold shadow-md' 
                  : 'bg-purple-950/40 text-purple-200 hover:bg-purple-900/60 border border-purple-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Microscope className={`w-4 h-4 ${activeTab === 'fungal' ? 'text-green-400' : 'text-purple-400'}`} />
                <span>MICORRIZAS Y TRICHODERMA (%)</span>
              </div>
              {activeTab === 'fungal' && <ChevronRight className="w-4 h-4 text-green-400" />}
            </button>

            <button
              onClick={() => setActiveTab('climate')}
              className={`w-full text-left p-3 rounded font-serif text-sm flex items-center justify-between transition-all ${
                activeTab === 'climate' 
                  ? 'bg-purple-800/90 text-yellow-300 border-l-4 border-green-400 font-bold shadow-md' 
                  : 'bg-purple-950/40 text-purple-200 hover:bg-purple-900/60 border border-purple-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CloudRain className={`w-4 h-4 ${activeTab === 'climate' ? 'text-green-400' : 'text-purple-400'}`} />
                <span>CLIMA Y ENFERMEDADES FOLIARES</span>
              </div>
              {activeTab === 'climate' && <ChevronRight className="w-4 h-4 text-green-400" />}
            </button>
          </nav>
        </div>

        {/* Quick Tools Section */}
        <div>
          <span className="text-[11px] font-mono text-purple-300 uppercase tracking-wider block mb-2 font-bold border-b border-purple-800 pb-1">
            [ ACCIONES & HERRAMIENTAS ]
          </span>

          <div className="space-y-2">
            <button 
              onClick={onOpenExport} 
              className="btn-navi btn-navi-green text-xs w-full justify-start"
            >
              <FileSpreadsheet className="w-4 h-4" /> EXCEL (.XLSX)
            </button>

            <button 
              onClick={onOpenSupabase} 
              className="btn-navi btn-navi-yellow text-xs w-full justify-start"
            >
              <Database className="w-4 h-4" /> BASE DE DATOS
            </button>

            <button 
              onClick={onOpenGuide} 
              className="btn-navi btn-navi-orange text-xs w-full justify-start"
            >
              <HelpCircle className="w-4 h-4" /> GUÍA APPS
            </button>
          </div>
        </div>

        {/* System Monitor Badge */}
        <div className="bg-purple-950/80 p-3 border border-purple-700 rounded text-xs font-mono space-y-1.5">
          <div className="flex justify-between items-center text-purple-300">
            <span>MUESTRAS:</span>
            <span className="text-yellow-300 font-bold">{morphoCount} / 9000</span>
          </div>
          <div className="flex justify-between items-center text-purple-300">
            <span>BD STATUS:</span>
            {isSupabaseConnected ? (
              <span className="text-green-400 font-bold">SUPABASE</span>
            ) : (
              <span className="text-orange-400 font-bold">LOCALSTORAGE</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-2.5 bg-[#140828] border-t border-purple-800 text-[10px] font-mono text-center text-purple-400">
        [ NAVI_SIDEBAR_ACTIVE ]
      </div>
    </aside>
  );
}
