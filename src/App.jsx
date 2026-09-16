import React, { useState, useEffect } from 'react';
import HeaderNavi from './components/HeaderNavi';
import SidebarNavi from './components/SidebarNavi';
import MorphoModule from './components/MorphoModule';
import FungalModule from './components/FungalModule';
import ClimateSanityModule from './components/ClimateSanityModule';
import ExcelExportModal from './components/ExcelExportModal';
import SupabaseConfigModal from './components/SupabaseConfigModal';
import UserGuideModal from './components/UserGuideModal';

import { getSupabaseClient, LocalDB } from './lib/supabaseClient';
import { initialMorphoRecords, initialFungalRecords, initialClimateRecords } from './lib/sampleData';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('morpho');

  // Modals
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Connection status
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Data Store
  const [morphoRecords, setMorphoRecords] = useState(() => {
    const saved = LocalDB.getMorphoData();
    return saved.length > 0 ? saved : initialMorphoRecords;
  });

  const [fungalRecords, setFungalRecords] = useState(() => {
    const saved = LocalDB.getFungalData();
    return saved.length > 0 ? saved : initialFungalRecords;
  });

  const [climateRecords, setClimateRecords] = useState(() => {
    const saved = LocalDB.getClimateData();
    return saved.length > 0 ? saved : initialClimateRecords;
  });

  // Check Supabase status
  const refreshConnection = () => {
    const client = getSupabaseClient();
    setSupabaseClient(client);
    setIsConnected(!!client);
  };

  useEffect(() => {
    refreshConnection();
  }, []);

  // Save to LocalStorage whenever records change
  useEffect(() => {
    LocalDB.saveMorphoData(morphoRecords);
  }, [morphoRecords]);

  useEffect(() => {
    LocalDB.saveFungalData(fungalRecords);
  }, [fungalRecords]);

  useEffect(() => {
    LocalDB.saveClimateData(climateRecords);
  }, [climateRecords]);

  return (
    <div className="min-h-screen pb-12 flex flex-col relative">
      {/* Subtle CRT Scanlines Effect Overlay */}
      <div className="crt-overlay" />

      {/* Header Bar */}
      <HeaderNavi 
        onOpenExport={() => setShowExportModal(true)}
        onOpenSupabase={() => setShowSupabaseModal(true)}
        onOpenGuide={() => setShowGuideModal(true)}
        isSupabaseConnected={isConnected}
        morphoCount={morphoRecords.length}
      />

      {/* Main App Container: Left Sidebar Picker + Active Module Window */}
      <div className="max-w-7xl w-full mx-auto px-4 mt-2 flex-grow flex flex-col md:flex-row gap-6 items-start">
        {/* Left Sidebar Module Picker */}
        <SidebarNavi 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onOpenExport={() => setShowExportModal(true)}
          onOpenSupabase={() => setShowSupabaseModal(true)}
          onOpenGuide={() => setShowGuideModal(true)}
          isSupabaseConnected={isConnected}
          morphoCount={morphoRecords.length}
        />

        {/* Right Active Module View */}
        <main className="w-full flex-grow min-w-0">
          {activeTab === 'morpho' && (
            <MorphoModule records={morphoRecords} setRecords={setMorphoRecords} />
          )}

          {activeTab === 'fungal' && (
            <FungalModule records={fungalRecords} setRecords={setFungalRecords} />
          )}

          {activeTab === 'climate' && (
            <ClimateSanityModule records={climateRecords} setRecords={setClimateRecords} />
          )}
        </main>
      </div>

      {/* Lain Wired Footer & TachibanaLab Signature */}
      <footer className="mt-12 border-t border-purple-900/80 bg-[#120721]/90 py-6 px-4 text-center font-serif">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3">
          <div className="flex flex-col sm:flex-row justify-between items-center w-full text-xs text-purple-400 font-mono">
            <span>AGRONAVI CYBERIA // SISTEMA DE CAPTURA Y EXPORTACIÓN AGRONÓMICA</span>
            <span className="text-yellow-400">TIPOGRAFÍA: TIMES NEW ROMAN // MORADO + VERDE + AMARILLO + NARANJA</span>
            <span className="text-green-400">ESTADO: ONLINE</span>
          </div>

          <div className="mt-2 tachibana-signature">
            an OS Enterprise Product By TachibanaLab
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExcelExportModal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        morphoRecords={morphoRecords}
        fungalRecords={fungalRecords}
        climateRecords={climateRecords}
      />

      <SupabaseConfigModal 
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
        isConnected={isConnected}
        onRefreshConnection={refreshConnection}
      />

      <UserGuideModal 
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </div>
  );
}
