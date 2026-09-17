import React, { useState } from 'react';
import { HelpCircle, X, Terminal, Server, ExternalLink, Copy, Check } from 'lucide-react';

export default function UserGuideModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlScript = `-- SCRIPT SQL PARA SUPABASE (Copiar en SQL Editor de tu proyecto Supabase)

-- 1. Tabla de Parámetros Morfológicos (Soporta hasta 25,000 muestras)
CREATE TABLE IF NOT EXISTS morphological_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_no INT NOT NULL,
  block_id TEXT,
  treatment TEXT,
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
  tricho_cuts INT NOT NULL,
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
      <div className="navi-window w-full max-w-3xl p-6 rounded border border-emerald-500 relative bg-[#111827] my-8 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 border-b border-gray-700 pb-3 mb-5">
          <div className="w-10 h-10 rounded bg-emerald-950 border border-emerald-400 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-100">GUÍA DE INSTALACIÓN, BASE DE DATOS Y VERCEL</h2>
            <p className="text-xs text-gray-400">Paso a paso para probar localmente y desplegar en la nube</p>
          </div>
        </div>

        <div className="space-y-6 text-xs text-gray-300">
          {/* Paso 1: Localhost */}
          <div className="bg-gray-900 p-4 rounded border border-gray-800">
            <h3 className="font-bold text-emerald-400 text-sm mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" /> 1. PROBAR EN LOCALHOST
            </h3>
            <p className="text-xs text-gray-300 mb-2">
              La app está optimizada para manejar hasta 25,000 muestras locales. Puedes ingresar datos, organizar por bloques y exportar a Excel sin necesidad de conexión.
            </p>
            <div className="bg-black/60 p-2.5 rounded font-mono text-xs text-amber-400 border border-gray-800">
              npm run dev &nbsp;&nbsp;&mdash;&nbsp;&nbsp; (Abierto en http://localhost:3000)
            </div>
          </div>

          {/* Paso 2: Supabase SQL */}
          <div className="bg-gray-900 p-4 rounded border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" /> 2. TABLAS EN SUPABASE (SOPORTA 25,000 REGISTROS)
              </h3>
              <button onClick={copySql} className="btn-navi btn-navi-yellow text-xs py-1">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />} {copied ? '¡COPIADO!' : 'COPIAR SCRIPT SQL'}
              </button>
            </div>
            <ol className="list-decimal list-inside text-xs text-gray-300 space-y-1 mb-3">
              <li>Ingresa a tu proyecto en <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-sky-400 underline">supabase.com</a>.</li>
              <li>Ve a <strong>SQL Editor</strong> en el menú lateral.</li>
              <li>Pega el código SQL a continuación y presiona <strong>RUN</strong>:</li>
            </ol>

            <pre className="bg-black/80 p-3 rounded text-[11px] font-mono text-emerald-400 border border-gray-800 overflow-x-auto max-h-48">
              {sqlScript}
            </pre>
          </div>

          {/* Paso 3: Despliegue en Vercel */}
          <div className="bg-gray-900 p-4 rounded border border-gray-800">
            <h3 className="font-bold text-sky-400 text-sm mb-2 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-sky-400" /> 3. DESPLIEGUE EN VERCEL
            </h3>
            <ol className="list-decimal list-inside text-xs text-gray-300 space-y-1">
              <li>El código está conectado con tu repositorio GitHub <strong>benvlock/agronavi</strong>.</li>
              <li>Vercel compilará automáticamente en cada push a la rama <code>main</code>.</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-800 flex justify-end">
          <button onClick={onClose} className="btn-navi btn-navi-green text-xs font-bold">
            ENTENDIDO, VOLVER A LA APP
          </button>
        </div>
      </div>
    </div>
  );
}
