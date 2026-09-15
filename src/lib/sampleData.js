export const initialMorphoRecords = Array.from({ length: 15 }, (_, i) => ({
  id: `m-${i + 1}`,
  sampleNo: i + 1,
  plantId: `PLT-${String(i + 1).padStart(4, '0')}`,
  height: (35.5 + Math.sin(i) * 8 + (i * 0.8)).toFixed(1),
  diameter: (4.2 + (i * 0.15) + (Math.cos(i) * 0.8)).toFixed(2),
  leaves: Math.floor(8 + (i % 6) + Math.random() * 3),
  date: new Date(Date.now() - (15 - i) * 86400000).toISOString().split('T')[0],
  notes: i % 3 === 0 ? 'Vigor bueno, follaje verde denso' : 'Desarrollo normal'
}));

export const initialFungalRecords = [
  {
    id: 'f-1',
    date: '2026-09-01',
    sampleName: 'Muestra Raíz Lote A (Cacao/Café)',
    totalCuts: 50,
    micoCuts: 38,
    trichoCuts: 24,
    notes: 'Presencia abundante de vesículas micorrízicas'
  },
  {
    id: 'f-2',
    date: '2026-09-08',
    sampleName: 'Muestra Raíz Lote B (Cacaotero Tratado)',
    totalCuts: 40,
    micoCuts: 31,
    trichoCuts: 35,
    notes: 'Alta colonización de Trichoderma harzianum'
  },
  {
    id: 'f-3',
    date: '2026-09-15',
    sampleName: 'Muestra Raíz Lote C (Testigo)',
    totalCuts: 60,
    micoCuts: 18,
    trichoCuts: 12,
    notes: 'Suelo sin inoculación previa'
  }
];

export const initialClimateRecords = [
  {
    id: 'c-1',
    date: '2026-09-10',
    tempMin: 18.5,
    tempMax: 29.2,
    tempAvg: 23.8,
    rainMm: 14.5,
    diseaseName: 'Moniliasis / Moniliophthora roreri',
    diseaseSeverity: 'Escala 2 (Leve 10-20%)',
    diseasePct: 15,
    notes: 'Lluvia moderada en la tarde'
  },
  {
    id: 'c-2',
    date: '2026-09-12',
    tempMin: 19.1,
    tempMax: 31.0,
    tempAvg: 25.0,
    rainMm: 32.0,
    diseaseName: 'Roya / Hemileia vastatrix',
    diseaseSeverity: 'Escala 3 (Moderado 25%)',
    diseasePct: 25,
    notes: 'Precipitación fuerte. Aplicación biocontrolador'
  },
  {
    id: 'c-3',
    date: '2026-09-14',
    tempMin: 17.8,
    tempMax: 27.5,
    tempAvg: 22.6,
    rainMm: 5.0,
    diseaseName: 'Mancha de Hierro (Cercospora)',
    diseaseSeverity: 'Escala 1 (Inicial <5%)',
    diseasePct: 4,
    notes: 'Sin novedades fitosanitarias graves'
  }
];
