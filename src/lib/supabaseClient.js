import { createClient } from '@supabase/supabase-js';

// Keys loaded from env or dynamic configuration stored in localStorage
const getSupabaseCredentials = () => {
  const defaultUrl = 'https://kxcimenkkujxfvnvemnk.supabase.co';
  const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4Y2ltZW5ra3VqeGZ2bnZlbW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0OTY4NzEsImV4cCI6MjEwNTA3Mjg3MX0.uDFwPHow6o5S8LgnbTgg4sI5Ymq82QCwYQKBmn4UEME';

  const envUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultKey;

  const customUrl = localStorage.getItem('AGRONAVI_SUPABASE_URL') || envUrl;
  const customKey = localStorage.getItem('AGRONAVI_SUPABASE_KEY') || envKey;

  return { url: customUrl, key: customKey };
};

export const getSupabaseClient = () => {
  const { url, key } = getSupabaseCredentials();
  if (url && key && url.startsWith('http')) {
    try {
      return createClient(url, key);
    } catch (e) {
      console.warn('Error al inicializar cliente Supabase:', e);
      return null;
    }
  }
  return null;
};

export const saveSupabaseCredentials = (url, key) => {
  localStorage.setItem('AGRONAVI_SUPABASE_URL', url.trim());
  localStorage.setItem('AGRONAVI_SUPABASE_KEY', key.trim());
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('AGRONAVI_SUPABASE_URL');
  localStorage.removeItem('AGRONAVI_SUPABASE_KEY');
};

// LocalStorage Persistence Helpers for offline execution
export const LocalDB = {
  getMorphoData: () => {
    const data = localStorage.getItem('AGRONAVI_MORPHO_DATA');
    return data ? JSON.parse(data) : [];
  },
  saveMorphoData: (records) => {
    localStorage.setItem('AGRONAVI_MORPHO_DATA', JSON.stringify(records));
  },
  
  getFungalData: () => {
    const data = localStorage.getItem('AGRONAVI_FUNGAL_DATA');
    return data ? JSON.parse(data) : [];
  },
  saveFungalData: (records) => {
    localStorage.setItem('AGRONAVI_FUNGAL_DATA', JSON.stringify(records));
  },

  getClimateData: () => {
    const data = localStorage.getItem('AGRONAVI_CLIMATE_DATA');
    return data ? JSON.parse(data) : [];
  },
  saveClimateData: (records) => {
    localStorage.setItem('AGRONAVI_CLIMATE_DATA', JSON.stringify(records));
  }
};
