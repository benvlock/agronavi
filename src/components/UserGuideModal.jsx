import React, { useState } from 'react';
import { HelpCircle, X, Code, Terminal, Server, ExternalLink, Copy, Check } from 'lucide-react';

export default function UserGuideModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlScript = `-- SCRIPT SQL PARA SUPABASE (Copiar en SQL Editor de tu proyecto Supabase)

-- 1. Tabla de Parámetros Morfológicos (Soporta hasta 9,000 muestras)
CREATE TABLE IF NOT EXISTS morphological_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_no INT NOT NULL,
  plant_id TEXT NOT NULL,
  height NUMERIC(6,2) NOT NULL,
  diameter NUMERIC(6,2) NOT NULL,
  leaves INT NOT NULL,
  recorded_at DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Colonización Fúngica (Micorrizas y Trichoderma)
CREATE TABLE IF NOT EXISTS fungal_colonization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_name TEXT NOT NULL,
  total_cuts INT NOT NULL,
  mico_cuts INT NOT NULL,
  trichoCuts INT NOT NULL,
  recorded_at DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Clima y Fitosanidad Foliar
CREATE TABLE IF NOT EXISTS climate_phytosanitary_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorded_at DATE DEFAULT CURRENT_DATE,
  temp_min NUMERIC(5,2),
  temp_max NUMERIC(5,2),
  temp_avg NUMERIC(5,2),
  rain_mm NUMERIC(6,2),
  disease_name TEXT,
  disease_severity TEXT,
  disease_pct NUMERIC(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="navi-card w-full max-w-3xl p-6 rounded border-2 border-orange-400 navi-border-orange relative my-8 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-purple-300 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 border-b border-purple-800 pb-3 mb-5">
          <div className="w-10 h-10 rounded bg-orange-950 border border-orange-400 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-yellow-400">GUÍA DE INSTALACIÓN, SUPABASE Y VERCEL</h2>
            <p className="text-xs text-purple-300">Paso a paso para probar localmente y desplegar en la nube</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-purple-100">
          {/* Paso 1: Localhost */}
          <div className="bg-purple-950/80 p-4 rounded border border-purple-700">
            <h3 className="font-bold text-green-400 text-base mb-2 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-green-400" /> 1. PROBAR EN LOCALHOST (TU NAVEGADOR)
            </h3>
            <p className="text-xs text-gray-300 mb-2">
              Ya estás corriendo esta app en tu equipo local. Puedes ingresar muestras, calcular colonización fúngica y descargar el archivo Excel inmediatamente.
            </p>
            <div className="bg-black/60 p-2.5 rounded font-mono text-xs text-yellow-300 border border-purple-900">
              npm run dev &nbsp;&nbsp;&mdash;&nbsp;&nbsp; (Abierto en http://localhost:3000)
            </div>
          </div>

          {/* Paso 2: Supabase SQL */}
          <div className="bg-purple-950/80 p-4 rounded border border-purple-700">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-yellow-400 text-base flex items-center gap-2">
                <Server className="w-5 h-5 text-yellow-400" /> 2. CREAR BASE DE DATOS EN SUPABASE
              </h3>
              <button onClick={copySql} className="btn-navi btn-navi-yellow text-xs py-1">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />} {copied ? '¡COPIADO!' : 'COPIAR SCRIPT SQL'}
              </button>
            </div>
            <ol className="list-decimal list-inside text-xs text-gray-300 space-y-1 mb-3">
              <li>Crea una cuenta gratuita en <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">supabase.com</a> y crea un nuevo proyecto.</li>
              <li>En el panel lateral izquierdo, ve a <strong>SQL Editor</strong>.</li>
              <li>Pega el siguiente código SQL y presiona <strong>RUN</strong> para crear las tablas:</li>
            </ol>

            <pre className="bg-black/80 p-3 rounded text-[11px] font-mono text-green-300 border border-purple-800 overflow-x-auto max-h-48">
              {sqlScript}
            </pre>
          </div>

          {/* Paso 3: Despliegue en Vercel */}
          <div className="bg-purple-950/80 p-4 rounded border border-purple-700">
            <h3 className="font-bold text-orange-400 text-base mb-2 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-orange-400" /> 3. DESPLIEGUE GRATUITO EN VERCEL
            </h3>
            <ol className="list-decimal list-inside text-xs text-gray-300 space-y-1">
              <li>Sube este código a tu repositorio de GitHub.</li>
              <li>Ingresa a <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">vercel.com</a> e inicia sesión con tu GitHub.</li>
              <li>Haz clic en <strong>"Add New Project"</strong> y selecciona este repositorio.</li>
              <li>En <em>Environment Variables</em> opcionalmente agrega:
                <ul className="list-disc list-inside ml-4 font-mono text-[11px] text-yellow-300 mt-1">
                  <li>VITE_SUPABASE_URL</li>
                  <li>VITE_SUPABASE_ANON_KEY</li>
                </ul>
              </li>
              <li>Presiona <strong>Deploy</strong> y en 1 minuto tendrás tu enlace web público listo.</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-purple-800 flex justify-end">
          <button onClick={onClose} className="btn-navi btn-navi-green text-xs font-bold">
            ENTENDIDO, VOLVER A LA APP
          </button>
        </div>
      </div>
    </div>
  );
}
