import React, { useState, useEffect } from 'react';
import HeaderNavi from './components/HeaderNavi';
import SidebarNavi from './components/SidebarNavi';
import BootLogin from './components/BootLogin';
import TcgCarousel from './components/TcgCarousel';
import MorphoModule from './components/MorphoModule';
import FungalModule from './components/FungalModule';
import ClimateSanityModule from './components/ClimateSanityModule';
import DiseaseModule from './components/DiseaseModule';
import ExcelExportModal from './components/ExcelExportModal';
import SupabaseConfigModal from './components/SupabaseConfigModal';
import UserGuideModal from './components/UserGuideModal';

import { getSupabaseClient, LocalDB } from './lib/supabaseClient';
import { initialMorphoRecords, initialFungalRecords, initialClimateRecords } from './lib/sampleData';

export default function App() {
  // Operator Auth Session State
  const [operatorSession, setOperatorSession] = useState(() => {
    const saved = localStorage.getItem('AGRONAVI_OPERATOR_SESSION');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation State: 'carousel' | 'morpho' | 'fungal' | 'climate' | 'disease'
  const [activeTab, setActiveTab] = useState('carousel');

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

  const [diseaseRecords, setDiseaseRecords] = useState(() => {
    const saved = localStorage.getItem('AGRONAVI_DISEASE_DATA');
    return saved ? JSON.parse(saved) : [];
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

  useEffect(() => {
    localStorage.setItem('AGRONAVI_DISEASE_DATA', JSON.stringify(diseaseRecords));
  }, [diseaseRecords]);

  // Handle Login & Logout
  const handleLogin = (sessionData) => {
    localStorage.setItem('AGRONAVI_OPERATOR_SESSION', JSON.stringify(sessionData));
    setOperatorSession(sessionData);
  };

  const handleLogout = () => {
    if (window.confirm('¿Cerrar sesión de operador?')) {
      localStorage.removeItem('AGRONAVI_OPERATOR_SESSION');
      setOperatorSession(null);
      setActiveTab('carousel');
    }
  };

  // If not authenticated, show Boot Sequence & Glassmorphism Login Form
  if (!operatorSession) {
    return <BootLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen pb-12 flex flex-col relative font-mono selection:bg-[#00ff88] selection:text-[#0a0a0c]">
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

      {/* Main App Container: Left Sidebar Picker + Active View */}
      <div className="max-w-7xl w-full mx-auto px-4 mt-2 flex-grow flex flex-col md:flex-row gap-6 items-start">
        {/* Left Sidebar Navigation */}
        <SidebarNavi 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onOpenExport={() => setShowExportModal(true)}
          onOpenSupabase={() => setShowSupabaseModal(true)}
          onOpenGuide={() => setShowGuideModal(true)}
          isSupabaseConnected={isConnected}
          morphoCount={morphoRecords.length}
          operatorSession={operatorSession}
          onLogout={handleLogout}
        />

        {/* Right Active View Area */}
        <main className="w-full flex-grow min-w-0">
          {activeTab === 'carousel' && (
            <TcgCarousel onSelectModule={(moduleName) => setActiveTab(moduleName)} />
          )}

          {activeTab === 'morpho' && (
            <MorphoModule records={morphoRecords} setRecords={setMorphoRecords} />
          )}

          {activeTab === 'fungal' && (
            <FungalModule records={fungalRecords} setRecords={setFungalRecords} />
          )}

          {activeTab === 'climate' && (
            <ClimateSanityModule records={climateRecords} setRecords={setClimateRecords} />
          )}

          {activeTab === 'disease' && (
            <DiseaseModule records={diseaseRecords} setRecords={setDiseaseRecords} />
          )}
        </main>
      </div>

      {/* Lain Wired Footer & TachibanaLab Signature */}
      <footer className="mt-12 border-t border-purple-900/80 bg-[#120721]/90 py-6 px-4 text-center font-serif">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3">
          <div className="flex flex-col sm:flex-row justify-between items-center w-full text-xs text-purple-400 font-mono">
            <span>AGRONAVI CYBERIA // COPLAND OS V4.0 TCG EDITION</span>
            <span className="text-[#00ff88]">OPERADOR: {operatorSession.operatorName}</span>
            <span className="text-[#00e5ff]">BD: {isConnected ? 'SUPABASE CLOUD' : 'LOCALSTORAGE'}</span>
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
