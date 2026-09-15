-- SCRIPT SQL DE AGRONAVI CYBERIA PARA SUPABASE
-- Copia y ejecuta este script en el SQL Editor de tu proyecto en Supabase (https://supabase.com)

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
);

-- Habilitar permisos de lectura y escritura para el cliente anon key
ALTER TABLE morphological_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE fungal_colonization ENABLE ROW LEVEL SECURITY;
ALTER TABLE climate_phytosanitary_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura y escritura anonima morpho" ON morphological_data FOR ALL USING (true);
CREATE POLICY "Permitir lectura y escritura anonima fungal" ON fungal_colonization FOR ALL USING (true);
CREATE POLICY "Permitir lectura y escritura anonima climate" ON climate_phytosanitary_logs FOR ALL USING (true);
