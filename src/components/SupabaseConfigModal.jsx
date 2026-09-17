import React, { useState } from 'react';
import { Database, X, Check, Trash2, Key } from 'lucide-react';
import { saveSupabaseCredentials, clearSupabaseCredentials } from '../lib/supabaseClient';

export default function SupabaseConfigModal({ isOpen, onClose, isConnected, onRefreshConnection }) {
  const [url, setUrl] = useState(localStorage.getItem('AGRONAVI_SUPABASE_URL') || '');
  const [key, setKey] = useState(localStorage.getItem('AGRONAVI_SUPABASE_KEY') || '');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!url || !key) {
      alert('Ingresa tanto la URL como la Anon Key de Supabase.');
      return;
    }
    saveSupabaseCredentials(url, key);
    onRefreshConnection();
    alert('Credenciales guardadas. Intentando conectar...');
    onClose();
  };

  const handleClear = () => {
    if (window.confirm('¿Desconectar Supabase y volver al modo LocalStorage offline?')) {
      clearSupabaseCredentials();
      setUrl('');
      setKey('');
      onRefreshConnection();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="navi-window w-full max-w-lg p-6 rounded border border-amber-500 relative bg-[#111827]">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-gray-700 pb-3 mb-4">
          <div className="w-10 h-10 rounded bg-amber-950 border border-amber-400 flex items-center justify-center">
            <Database className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-100">CONFIGURACIÓN BASE DE DATOS SUPABASE</h2>
            <p className="text-xs text-gray-400">Conecta tu proyecto en la nube o usa almacenamiento local</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="text-amber-400 font-semibold flex items-center gap-1">
              <Key className="w-4 h-4 text-emerald-400" /> SUPABASE PROJECT URL
            </label>
            <input 
              type="url" 
              placeholder="https://xyz.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full font-mono text-xs bg-gray-900 border-gray-700"
            />
          </div>

          <div>
            <label className="text-amber-400 font-semibold flex items-center gap-1">
              <Key className="w-4 h-4 text-amber-400" /> SUPABASE ANON API KEY
            </label>
            <textarea 
              rows="3"
              placeholder="eyJhbGciOiJIUzI1NiIsInR..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full font-mono text-xs bg-gray-900 border-gray-700"
            />
          </div>

          <div className="bg-gray-900 p-3 rounded border border-gray-800 text-xs">
            <span className="font-semibold text-gray-400 block mb-1">ESTADO ACTUAL:</span>
            {isConnected ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> CONECTADO A SUPABASE CLOUD
              </span>
            ) : (
              <span className="text-amber-400 font-bold">
                MODO OFFLINE (Guardando en LocalStorage local)
              </span>
            )}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-700">
            {isConnected && (
              <button 
                type="button" 
                onClick={handleClear} 
                className="btn-navi btn-navi-orange text-xs"
              >
                <Trash2 className="w-4 h-4" /> DESCONECTAR
              </button>
            )}

            <div className="flex gap-2 ml-auto">
              <button type="button" onClick={onClose} className="btn-navi text-xs">
                CANCELAR
              </button>
              <button type="submit" className="btn-navi btn-navi-yellow text-xs font-bold">
                <Check className="w-4 h-4" /> GUARDAR Y CONECTAR
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
