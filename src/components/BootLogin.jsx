import React, { useState, useEffect } from 'react';
import { Lock, User, Calendar, CheckCircle, Terminal } from 'lucide-react';
import gsap from 'gsap';

export default function BootLogin({ onLogin }) {
  const [phase, setPhase] = useState('boot'); // 'boot' | 'login'
  const [operatorName, setOperatorName] = useState('');
  const [accessDate, setAccessDate] = useState(new Date().toISOString().split('T')[0]);

  // Phase 1: Boot sequence - centered AGRONAVI OS logo
  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.to('#boot-text-container', {
        opacity: 0,
        scale: 0.95,
        duration: 0.35,
        onComplete: () => {
          setPhase('login');
        }
      });
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  // GSAP animation when login form appears
  useEffect(() => {
    if (phase === 'login') {
      gsap.fromTo(
        '#login-card',
        { opacity: 0, y: 15, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [phase]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!operatorName.trim() || !accessDate) {
      alert('Por favor completa tanto el Nombre de Usuario como la Fecha de Entrada.');
      return;
    }

    gsap.to('#login-card', {
      opacity: 0,
      y: -15,
      duration: 0.3,
      onComplete: () => {
        onLogin({ operatorName: operatorName.trim(), accessDate });
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-[#090d16] z-50 flex items-center justify-center min-h-screen p-4 font-mono select-none overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* 1. Pantalla de Carga Centrada (AGRONAVI OS) */}
      {phase === 'boot' && (
        <div id="boot-text-container" className="flex flex-col items-center justify-center text-center z-10">
          <Terminal className="w-10 h-10 text-emerald-400 mb-3" />
          <h1 className="text-4xl font-bold text-emerald-400 tracking-wider">
            AGRONAVI OS
          </h1>
          <span className="text-xs text-sky-400 tracking-widest mt-2">
            INICIALIZANDO PLATAFORMA DE CAMPO Y LAB (25,000 MUESTRAS)...
          </span>
        </div>
      )}

      {/* 2. Formulario de Identificación Centrado */}
      {phase === 'login' && (
        <div 
          id="login-card"
          className="w-full max-w-md bg-[#111827] border border-emerald-500/60 p-6 rounded-lg shadow-2xl z-10"
        >
          <div className="flex items-center gap-2 border-b border-gray-700 pb-3 mb-5">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-emerald-400">ACCESO DE OPERADOR</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-gray-300 block mb-1 font-semibold flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-400" /> NOMBRE DE USUARIO / TÉCNICO *
              </label>
              <input 
                type="text"
                placeholder="Ingresa tu nombre..."
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full bg-[#0d131f] border border-gray-700 rounded px-3 py-2.5 text-gray-100 font-mono focus:border-emerald-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-gray-300 block mb-1 font-semibold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" /> FECHA DE INGRESO *
              </label>
              <input 
                type="date"
                value={accessDate}
                onChange={(e) => setAccessDate(e.target.value)}
                className="w-full bg-[#0d131f] border border-gray-700 rounded px-3 py-2.5 text-gray-100 font-mono focus:border-emerald-400 outline-none"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full mt-4 btn-navi btn-navi-green justify-center py-3 font-bold text-xs"
            >
              <CheckCircle className="w-4 h-4" /> ACCEDER A LA SISTEMÁTICA
            </button>
          </form>
        </div>
      )}

      {/* TachibanaLab Signature */}
      <div className="absolute bottom-4 text-center text-[11px] text-gray-500 tracking-wider font-mono z-10">
        an OS Enterprise Product By TachibanaLab
      </div>
    </div>
  );
}
