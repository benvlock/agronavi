import React, { useState, useEffect } from 'react';
import HeaderNavi from './components/HeaderNavi';
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
    <div className="min-h-screen pb-12 flex flex-col">
      {/* Lain OS Header */}
      <HeaderNavi 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenExport={() => setShowExportModal(true)}
        onOpenSupabase={() => setShowSupabaseModal(true)}
        onOpenGuide={() => setShowGuideModal(true)}
        isSupabaseConnected={isConnected}
        morphoCount={morphoRecords.length}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 mt-6 flex-grow">
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

      {/* Lain Wired Footer */}
      <footer className="mt-12 border-t border-purple-900 bg-purple-950/80 py-4 px-4 text-center text-xs text-purple-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>AGRONAVI CYBERIA // SISTEMA DE CAPTURA Y EXPORTACIÓN AGRONÓMICA</span>
          <span className="text-yellow-400">TIPOGRAFÍA: TIMES NEW ROMAN // PALETA: MORADO + VERDE + AMARILLO + NARANJA</span>
          <span>ESTADO: LOCALHOST PRUEBA OK</span>
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
