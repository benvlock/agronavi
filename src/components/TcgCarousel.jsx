import React, { useEffect, useRef, useState } from 'react';
import { Sprout, Microscope, CloudRain, ShieldAlert, Sparkles, FolderOpen, RotateCw } from 'lucide-react';
import gsap from 'gsap';

export default function TcgCarousel({ onSelectModule }) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const cardsRef = useRef([]);

  const packs = [
    {
      id: 'morpho',
      title: 'PARÁMETROS MORFOLÓGICOS',
      subtitle: 'Altura (cm), Diámetro Basal (mm), N° Hojas',
      badge: '0-9000 MUESTRAS',
      color: '#00ff88',
      glowColor: 'rgba(0, 255, 136, 0.4)',
      icon: Sprout
    },
    {
      id: 'fungal',
      title: 'MICORRIZAS Y TRICHODERMA (%)',
      subtitle: 'Colonización Radicular & Biocontrol',
      badge: 'VAM & TRICHODERMA',
      color: '#bd00ff',
      glowColor: 'rgba(189, 0, 255, 0.4)',
      icon: Microscope
    },
    {
      id: 'climate',
      title: 'CLIMA INTEGRAL',
      subtitle: 'Temperatura (°C), Lluvia (mm) Log',
      badge: 'DATOS CLIMÁTICOS',
      color: '#00e5ff',
      glowColor: 'rgba(0, 229, 255, 0.4)',
      icon: CloudRain
    },
    {
      id: 'disease',
      title: 'ENFERMEDADES EN PLANTAS (%)',
      subtitle: 'Severidad Foliar (0-5) & Incidencia',
      badge: 'FITOSANIDAD LOTE',
      color: '#ff6600',
      glowColor: 'rgba(255, 102, 0, 0.4)',
      icon: ShieldAlert
    }
  ];

  // GSAP Levitating Sine Wave Animation
  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.to(card, {
          y: '+=14',
          duration: 2.2 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.2
        });
      }
    });
  }, []);

  // 3D Tilt Effect on Cursor Move
  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (-y / (rect.height / 2)) * 18;
    const rotateY = (x / (rect.width / 2)) * 18;

    gsap.to(card, {
      rotateX,
      rotateY,
      scale: 1.05,
      duration: 0.25,
      ease: 'power1.out'
    });
  };

  const handleMouseLeave = (index) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  const handleOpenPack = (moduleName) => {
    const card = cardsRef.current[activeCardIndex];
    if (card) {
      gsap.to(card, {
        scale: 1.2,
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
          onSelectModule(moduleName);
        }
      });
    } else {
      onSelectModule(moduleName);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 select-none font-mono">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#00ff88] tracking-widest flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-[#00e5ff] wired-pulse" /> CATÁLOGO DE SOBRES AGRO NAVI 3D
        </h2>
        <p className="text-xs text-purple-300 mt-1">
          Haz clic en un sobre para enfocarlo | Haz doble clic o presiona [ ABRIR SOBRE ] para ingresar datos
        </p>
      </div>

      {/* 3D TCG Card Stack Carousel */}
      <div className="relative w-full max-w-5xl h-[440px] flex items-center justify-center perspective-[1200px]">
        {packs.map((pack, index) => {
          const Icon = pack.icon;
          const isActive = index === activeCardIndex;
          const offset = index - activeCardIndex;

          return (
            <div
              key={pack.id}
              ref={el => cardsRef.current[index] = el}
              onClick={() => setActiveTabCard(index)}
              onDoubleClick={() => handleOpenPack(pack.id)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              style={{
                borderColor: pack.color,
                boxShadow: isActive ? `0 0 35px ${pack.glowColor}` : '0 10px 25px rgba(0,0,0,0.8)',
                transformStyle: 'preserve-3d',
                zIndex: isActive ? 40 : 30 - Math.abs(offset) * 10
              }}
              className={`absolute w-72 h-[380px] bg-[#120826] border-2 rounded-xl p-5 cursor-pointer flex flex-col justify-between transition-all duration-500 navi-window ${
                isActive ? 'scale-105 border-opacity-100' : 'opacity-70 scale-95 border-opacity-40 hover:opacity-100'
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-center border-b border-purple-800 pb-2">
                <span className="text-[10px] font-mono text-purple-300">SOBRE #{index + 1}</span>
                <span 
                  className="text-[10px] px-2 py-0.5 rounded font-bold border"
                  style={{ color: pack.color, borderColor: pack.color }}
                >
                  {pack.badge}
                </span>
              </div>

              {/* Card Art Area */}
              <div className="flex flex-col items-center justify-center my-auto py-4">
                <div 
                  className="w-20 h-20 rounded-full border-2 flex items-center justify-center mb-4 transition-all duration-300"
                  style={{ borderColor: pack.color, backgroundColor: `${pack.color}15`, boxShadow: `0 0 20px ${pack.glowColor}` }}
                >
                  <Icon className="w-10 h-10" style={{ color: pack.color }} />
                </div>
                <h3 className="text-base font-bold text-center text-white tracking-wider" style={{ color: pack.color }}>
                  {pack.title}
                </h3>
                <p className="text-xs text-gray-400 text-center mt-2 font-serif">
                  {pack.subtitle}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-purple-800/80 flex flex-col gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenPack(pack.id); }}
                  className="btn-navi w-full justify-center text-xs py-2"
                  style={{ backgroundColor: `${pack.color}20`, borderColor: pack.color, color: pack.color }}
                >
                  <FolderOpen className="w-4 h-4" /> [ ABRIR SOBRE ]
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Carousel Navigation Indicator Dots */}
      <div className="flex items-center gap-3 mt-6">
        {packs.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setActiveTabCard(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === activeCardIndex 
                ? 'bg-[#00ff88] scale-125 shadow-[0_0_10px_#00ff88]' 
                : 'bg-purple-900 border border-purple-600 hover:bg-purple-700'
            }`}
          />
        ))}
      </div>
    </div>
  );

  function setActiveTabCard(idx) {
    setActiveCardIndex(idx);
  }
}
