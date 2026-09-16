import React, { useState, useEffect } from 'react';
import { Lock, User, Calendar, CheckCircle, Terminal } from 'lucide-react';
import gsap from 'gsap';

export default function BootLogin({ onLogin }) {
  const [phase, setPhase] = useState('boot'); // 'boot' | 'login'
  const [userName, setUserName] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);

  // Phase 1: Boot animation - centered AGRONAVI text
  useEffect(() => {
    const timer = setTimeout(() => {
      // Transition to Login Form
      gsap.to('#boot-text-container', {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        onComplete: () => {
          setPhase('login');
        }
      });
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  // GSAP animation when login form appears
  useEffect(() => {
    if (phase === 'login') {
      gsap.fromTo(
        '#login-card',
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [phase]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim() || !entryDate) {
      alert('Por favor completa tanto el Nombre de Usuario como la Fecha de Entrada.');
      return;
    }

    gsap.to('#login-card', {
      opacity: 0,
      y: -20,
      duration: 0.4,
      onComplete: () => {
        onLogin({ userName: userName.trim(), entryDate });
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0c] z-50 flex items-center justify-center min-h-screen p-4 font-mono select-none overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00ff88_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* 1. Pantalla de Carga Centrada (AGRONAVI) */}
      {phase === 'boot' && (
        <div id="boot-text-container" className="flex flex-col items-center justify-center text-center z-10">
          <Terminal className="w-12 h-12 text-[#00ff88] mb-4 wired-pulse" />
          <h1 className="text-4xl sm:text-5xl font-bold text-[#00ff88] tracking-widest text-shadow-[0_0_20px_rgba(0,255,136,0.6)]">
            AGRONAVI
          </h1>
          <span className="text-xs text-[#00e5ff] tracking-widest mt-2 animate-pulse">
            CARGANDO SISTEMA...
          </span>
        </div>
      )}

      {/* 2. Formulario de Identificación (Login) Centrado */}
      {phase === 'login' && (
        <div 
          id="login-card"
          className="w-full max-w-md bg-[#161622]/90 backdrop-blur-md border-2 border-[#00ff88] p-6 rounded-lg shadow-[0_0_35px_rgba(0,255,136,0.25)] z-10"
        >
          <div className="flex items-center gap-2 border-b border-[#00ff88]/30 pb-3 mb-5">
            <Lock className="w-5 h-5 text-[#00ff88]" />
            <h2 className="text-lg font-bold text-[#00ff88]">IDENTIFICACIÓN DE USUARIO</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="text-xs text-[#00e5ff] block mb-1 font-bold flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#00ff88]" /> NOMBRE DE USUARIO *
              </label>
              <input 
                type="text"
                placeholder="Ingresa tu nombre..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-[#00ff88]/50 rounded px-3 py-2.5 text-[#00ff88] font-mono focus:border-[#00ff88] focus:shadow-[0_0_10px_rgba(0,255,136,0.4)] outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs text-[#00e5ff] block mb-1 font-bold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#00ff88]" /> FECHA DE ENTRADA *
              </label>
              <input 
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-[#00ff88]/50 rounded px-3 py-2.5 text-[#00ff88] font-mono focus:border-[#00ff88] focus:shadow-[0_0_10px_rgba(0,255,136,0.4)] outline-none"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full mt-4 bg-[#00ff88]/20 hover:bg-[#00ff88] text-[#00ff88] hover:text-[#0a0a0c] font-bold border border-[#00ff88] py-3 rounded transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,136,0.2)]"
            >
              <CheckCircle className="w-4 h-4" /> [ ACCEDER ]
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
