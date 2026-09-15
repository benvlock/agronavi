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
      <div className="navi-card w-full max-w-lg p-6 rounded border-2 border-yellow-400 navi-border-yellow relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-purple-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-purple-800 pb-3 mb-4">
          <div className="w-10 h-10 rounded bg-yellow-950 border border-yellow-400 flex items-center justify-center">
            <Database className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-yellow-400">CONFIGURACIÓN BASE DE DATOS SUPABASE</h2>
            <p className="text-xs text-purple-300">Conecta tu proyecto en la nube o usa almacenamiento local</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-sm">
          <div>
            <label className="text-yellow-400 font-bold flex items-center gap-1">
              <Key className="w-4 h-4 text-green-400" /> SUPABASE PROJECT URL
            </label>
            <input 
              type="url" 
              placeholder="https://xyz.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-yellow-400 font-bold flex items-center gap-1">
              <Key className="w-4 h-4 text-yellow-400" /> SUPABASE ANON API KEY
            </label>
            <textarea 
              rows="3"
              placeholder="eyJhbGciOiJIUzI1NiIsInR..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full font-mono text-xs"
            />
          </div>

          <div className="bg-purple-950/70 p-3 rounded border border-purple-700 text-xs text-purple-200">
            <span className="font-bold text-green-400 block mb-1">ESTADO ACTUAL:</span>
            {isConnected ? (
              <span className="text-green-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> CONECTADO A SUPABASE CLOUD
              </span>
            ) : (
              <span className="text-orange-400 font-bold">
                MODO OFFLINE (Guardando localmente en LocalStorage de tu navegador)
              </span>
            )}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-purple-800">
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
