import React from 'react';
import { Sprout, Microscope, CloudRain, ShieldAlert, FileSpreadsheet, Database, HelpCircle, Activity, ChevronRight, Grid, LogOut } from 'lucide-react';

export default function SidebarNavi({ activeTab, setActiveTab, onOpenExport, onOpenSupabase, onOpenGuide, isSupabaseConnected, morphoCount, operatorSession, onLogout }) {
  return (
    <aside className="navi-window w-full md:w-64 shrink-0 flex flex-col justify-between select-none">
      {/* Window Header */}
      <div className="navi-window-header">
        <span className="font-mono text-xs text-yellow-300 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-green-400 wired-pulse" /> NAVI_SYSTEM_MENU.SYS
        </span>
        <div className="navi-window-controls">
          <div className="navi-win-btn">_</div>
          <div className="navi-win-btn">□</div>
        </div>
      </div>

      <div className="p-4 space-y-6 flex-grow font-mono">
        {/* Operator Badge */}
        {operatorSession && (
          <div className="bg-[#00ff88]/10 border border-[#00ff88]/40 p-2.5 rounded text-xs">
            <span className="text-gray-400 block text-[10px]">OPERADOR AUTENTICADO:</span>
            <span className="text-[#00ff88] font-bold block truncate">{operatorSession.operatorName}</span>
            <span className="text-[10px] text-[#00e5ff] block">{operatorSession.accessDate}</span>
          </div>
        )}

        {/* Return to 3D TCG Carousel Button */}
        <div>
          <button
            onClick={() => setActiveTab('carousel')}
            className={`w-full text-left p-2.5 rounded font-mono text-xs flex items-center justify-between border transition-all ${
              activeTab === 'carousel'
                ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff] font-bold'
                : 'bg-purple-950/60 text-purple-300 border-purple-800 hover:bg-purple-900/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-[#00e5ff]" />
              <span>[ CATÁLOGO 3D SOBRES ]</span>
            </div>
            {activeTab === 'carousel' && <ChevronRight className="w-4 h-4 text-[#00e5ff]" />}
          </button>
        </div>

        {/* Module Picker Section */}
        <div>
          <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider block mb-2 font-bold border-b border-purple-800 pb-1">
            [ CATÁLOGO DE SOBRES ]
          </span>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('morpho')}
              className={`w-full text-left p-2.5 rounded font-mono text-xs flex items-center justify-between transition-all ${
                activeTab === 'morpho' 
                  ? 'bg-purple-800/90 text-yellow-300 border-l-4 border-green-400 font-bold shadow-md' 
                  : 'bg-purple-950/40 text-purple-200 hover:bg-purple-900/60 border border-purple-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sprout className={`w-4 h-4 ${activeTab === 'morpho' ? 'text-green-400' : 'text-purple-400'}`} />
                <span>PARÁMETROS MORFOLÓGICOS</span>
              </div>
              {activeTab === 'morpho' && <ChevronRight className="w-4 h-4 text-green-400" />}
            </button>

            <button
              onClick={() => setActiveTab('fungal')}
              className={`w-full text-left p-2.5 rounded font-mono text-xs flex items-center justify-between transition-all ${
                activeTab === 'fungal' 
                  ? 'bg-purple-800/90 text-yellow-300 border-l-4 border-green-400 font-bold shadow-md' 
                  : 'bg-purple-950/40 text-purple-200 hover:bg-purple-900/60 border border-purple-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Microscope className={`w-4 h-4 ${activeTab === 'fungal' ? 'text-green-400' : 'text-purple-400'}`} />
                <span>MICORRIZAS & TRICHODERMA</span>
              </div>
              {activeTab === 'fungal' && <ChevronRight className="w-4 h-4 text-green-400" />}
            </button>

            <button
              onClick={() => setActiveTab('climate')}
              className={`w-full text-left p-2.5 rounded font-mono text-xs flex items-center justify-between transition-all ${
                activeTab === 'climate' 
                  ? 'bg-purple-800/90 text-yellow-300 border-l-4 border-green-400 font-bold shadow-md' 
                  : 'bg-purple-950/40 text-purple-200 hover:bg-purple-900/60 border border-purple-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <CloudRain className={`w-4 h-4 ${activeTab === 'climate' ? 'text-green-400' : 'text-purple-400'}`} />
                <span>CLIMA INTEGRAL</span>
              </div>
              {activeTab === 'climate' && <ChevronRight className="w-4 h-4 text-green-400" />}
            </button>

            <button
              onClick={() => setActiveTab('disease')}
              className={`w-full text-left p-2.5 rounded font-mono text-xs flex items-center justify-between transition-all ${
                activeTab === 'disease' 
                  ? 'bg-purple-800/90 text-yellow-300 border-l-4 border-green-400 font-bold shadow-md' 
                  : 'bg-purple-950/40 text-purple-200 hover:bg-purple-900/60 border border-purple-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-4 h-4 ${activeTab === 'disease' ? 'text-orange-400' : 'text-purple-400'}`} />
                <span>ENFERMEDADES EN PLANTAS (%)</span>
              </div>
              {activeTab === 'disease' && <ChevronRight className="w-4 h-4 text-orange-400" />}
            </button>
          </nav>
        </div>

        {/* Quick Tools Section */}
        <div>
          <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider block mb-2 font-bold border-b border-purple-800 pb-1">
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

            {onLogout && (
              <button 
                onClick={onLogout} 
                className="btn-navi text-xs w-full justify-start border-red-500 text-red-400 hover:bg-red-950"
              >
                <LogOut className="w-4 h-4" /> CERRAR SESIÓN
              </button>
            )}
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
        [ NAVI_COPLAND_OS_V4.0 ]
      </div>
    </aside>
  );
}
