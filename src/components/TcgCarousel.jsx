import React, { useEffect, useRef, useState } from 'react';
import { Sprout, Microscope, CloudRain, ShieldAlert, FolderOpen } from 'lucide-react';
import gsap from 'gsap';

export default function TcgCarousel({ onSelectModule }) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const cardsRef = useRef([]);

  const packs = [
    {
      id: 'morpho',
      title: 'MORFOLOGÍA DE PLANTA',
      subtitle: 'N° Hojas, Diámetro Basal (mm), Largo (cm), Bloques & Tratamientos',
      badge: 'HASTA 25,000 MUESTRAS',
      color: '#10b981',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      icon: Sprout
    },
    {
      id: 'fungal',
      title: 'MICORRIZAS Y TRICHODERMA (%)',
      subtitle: 'Colonización Radicular, Cortes Stereomicroscópicos & Biocontrol',
      badge: 'COLONIZACIÓN RADICULAR',
      color: '#38bdf8',
      glowColor: 'rgba(56, 189, 248, 0.25)',
      icon: Microscope
    },
    {
      id: 'climate',
      title: 'DATOS CLIMÁTICOS',
      subtitle: 'Temperaturas (°C), Precipitación (mm) & Alertas Ambientales',
      badge: 'ESTACIÓN & CAMPO',
      color: '#fbbf24',
      glowColor: 'rgba(251, 191, 36, 0.25)',
      icon: CloudRain
    },
    {
      id: 'disease',
      title: 'FITOSANIDAD Y EVALUACIÓN',
      subtitle: 'Severidad Foliar (Escala 0-5) & Incidencia % en Lotes',
      badge: 'FITOSANIDAD INTEGRAL',
      color: '#f43f5e',
      glowColor: 'rgba(244, 63, 94, 0.25)',
      icon: ShieldAlert
    }
  ];

  // GSAP Levitating Sine Wave Animation
  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.to(card, {
          y: '+=10',
          duration: 2.5 + index * 0.3,
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

    const rotateX = (-y / (rect.height / 2)) * 12;
    const rotateY = (x / (rect.width / 2)) * 12;

    gsap.to(card, {
      rotateX,
      rotateY,
      scale: 1.03,
      duration: 0.2,
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
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleOpenPack = (moduleName) => {
    const card = cardsRef.current[activeCardIndex];
    if (card) {
      gsap.to(card, {
        scale: 1.15,
        opacity: 0,
        duration: 0.3,
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
        <h2 className="text-xl font-bold text-emerald-400 tracking-wide">
          VISTA DE MÓDULOS DE RECOLECCIÓN
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Haz clic en un módulo para enfocarlo | Haz doble clic o presiona [ INGRESAR AL MÓDULO ]
        </p>
      </div>

      {/* 3D TCG Card Stack Carousel */}
      <div className="relative w-full max-w-5xl h-[420px] flex items-center justify-center perspective-[1200px]">
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
                boxShadow: isActive ? `0 0 25px ${pack.glowColor}` : '0 8px 20px rgba(0,0,0,0.6)',
                transformStyle: 'preserve-3d',
                zIndex: isActive ? 40 : 30 - Math.abs(offset) * 10
              }}
              className={`absolute w-72 h-[370px] bg-[#111827] border rounded-xl p-5 cursor-pointer flex flex-col justify-between transition-all duration-400 navi-window ${
                isActive ? 'scale-105 border-opacity-100' : 'opacity-65 scale-95 border-opacity-30 hover:opacity-100'
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                <span className="text-[10px] font-mono text-gray-400">MÓDULO #{index + 1}</span>
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
                  className="w-16 h-16 rounded-full border flex items-center justify-center mb-4 transition-all duration-300"
                  style={{ borderColor: pack.color, backgroundColor: `${pack.color}15` }}
                >
                  <Icon className="w-8 h-8" style={{ color: pack.color }} />
                </div>
                <h3 className="text-sm font-bold text-center text-white tracking-wide" style={{ color: pack.color }}>
                  {pack.title}
                </h3>
                <p className="text-xs text-gray-400 text-center mt-2 font-sans leading-relaxed">
                  {pack.subtitle}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-gray-700/80 flex flex-col gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenPack(pack.id); }}
                  className="btn-navi w-full justify-center text-xs py-2 font-bold"
                  style={{ backgroundColor: `${pack.color}20`, borderColor: pack.color, color: pack.color }}
                >
                  <FolderOpen className="w-4 h-4" /> [ INGRESAR AL MÓDULO ]
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Carousel Navigation Indicator Dots */}
      <div className="flex items-center gap-2.5 mt-6">
        {packs.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setActiveTabCard(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              idx === activeCardIndex 
                ? 'bg-emerald-400 scale-125' 
                : 'bg-gray-700 hover:bg-gray-500'
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
