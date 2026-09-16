import React, { useState, useEffect } from 'react';
import { Sprout, Lock, User, Calendar, Cpu, CheckCircle } from 'lucide-react';
import gsap from 'gsap';

export default function BootLogin({ onLogin }) {
  const [bootText, setBootText] = useState([]);
  const [bootComplete, setBootComplete] = useState(false);
  const [operatorName, setOperatorName] = useState('');
  const [accessDate, setAccessDate] = useState(new Date().toISOString().split('T')[0]);

  const bootLogs = [
    '> INITIALIZING AGRO NAVI COPLAND OS v4.0...',
    '> LOADING KERNEL DRIVERS [OK]',
    '> MOUNTING TACHIBANALAB HARDWARE INTERFACES [OK]',
    '> CONNECTING TO SUPABASE CLOUD DATABASE (kxcimenkkujxfvnvemnk) [OK]',
    '> INITIALIZING 3D TCG PACK CAROUSEL ENGINE [OK]',
    '> OPERATOR AUTHENTICATION REQUIRED.'
  ];

  // Terminal boot text animation
  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootLogs.length) {
        setBootText(prev => [...prev, bootLogs[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setBootComplete(true);
      }
    }, 350);

    return () => clearInterval(interval);
  }, []);

  // GSAP animation for login form appearance
  useEffect(() => {
    if (bootComplete) {
      gsap.fromTo(
        '#login-modal',
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
      );
    }
  }, [bootComplete]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!operatorName.trim()) {
      alert('Ingresa el Nombre del Operador para continuar.');
      return;
    }

    // Smooth exit animation
    gsap.to('#boot-screen', {
      opacity: 0,
      scale: 1.05,
      duration: 0.5,
      onComplete: () => {
        onLogin({ operatorName: operatorName.trim(), accessDate });
      }
    });
  };

  return (
    <div id="boot-screen" className="fixed inset-0 bg-[#0a0a0c] z-50 flex flex-col items-center justify-center p-4 font-mono select-none overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00ff88_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Header Logo */}
      <div className="flex flex-col items-center mb-6 z-10 text-center">
        <div className="w-16 h-16 rounded-full bg-[#00ff88]/10 border-2 border-[#00ff88] flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,255,136,0.3)]">
          <Sprout className="w-10 h-10 text-[#00ff88] wired-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-[#00ff88] tracking-widest text-shadow-[0_0_12px_rgba(0,255,136,0.5)]">
          AGRO NAVI OS
        </h1>
        <span className="text-xs text-[#00e5ff] tracking-widest mt-1">
          SYSTEM BOOT SEQUENCE // V4.0 COPLAND TCG
        </span>
      </div>

      {/* Terminal Boot Log Window */}
      <div className="w-full max-w-lg bg-[#111118]/90 border border-[#00e5ff]/40 p-4 rounded mb-6 font-mono text-xs text-[#00e5ff] space-y-1 z-10 shadow-[0_0_20px_rgba(0,229,255,0.15)] h-36 overflow-y-auto">
        {bootText.map((line, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-[#00ff88] font-bold">&gt;</span>
            <span>{line.replace('&gt;', '')}</span>
          </div>
        ))}
        {!bootComplete && (
          <div className="text-[#00ff88] animate-pulse">&gt; CARGANDO MÓDULOS...</div>
        )}
      </div>

      {/* Glassmorphism Authentication Form */}
      {bootComplete && (
        <div 
          id="login-modal"
          className="w-full max-w-md bg-[#161622]/80 backdrop-blur-md border-2 border-[#00ff88] p-6 rounded-lg shadow-[0_0_35px_rgba(0,255,136,0.25)] z-10"
        >
          <div className="flex items-center gap-2 border-b border-[#00ff88]/30 pb-3 mb-5">
            <Lock className="w-5 h-5 text-[#00ff88]" />
            <h2 className="text-lg font-bold text-[#00ff88]">AUTENTICACIÓN DE OPERADOR</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="text-xs text-[#00e5ff] block mb-1 font-bold flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#00ff88]" /> NOMBRE DEL OPERADOR *
              </label>
              <input 
                type="text"
                placeholder="Ej. Operador Benja"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-[#00ff88]/50 rounded px-3 py-2 text-[#00ff88] font-mono focus:border-[#00ff88] focus:shadow-[0_0_10px_rgba(0,255,136,0.4)] outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs text-[#00e5ff] block mb-1 font-bold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#00ff88]" /> FECHA DE ACCESO *
              </label>
              <input 
                type="date"
                value={accessDate}
                onChange={(e) => setAccessDate(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-[#00ff88]/50 rounded px-3 py-2 text-[#00ff88] font-mono focus:border-[#00ff88] focus:shadow-[0_0_10px_rgba(0,255,136,0.4)] outline-none"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full mt-4 bg-[#00ff88]/20 hover:bg-[#00ff88] text-[#00ff88] hover:text-[#0a0a0c] font-bold border border-[#00ff88] py-2.5 rounded transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,136,0.2)]"
            >
              <CheckCircle className="w-4 h-4" /> [ INICIAR SESIÓN ]
            </button>
          </form>
        </div>
      )}

      {/* TachibanaLab Signature */}
      <div className="absolute bottom-4 text-center text-xs text-[#5a258c] tracking-widest font-bold z-10">
        an OS Enterprise Product By TachibanaLab
      </div>
    </div>
  );
}
