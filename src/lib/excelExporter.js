import * as XLSX from 'xlsx';

export const exportAgroNaviToExcel = (morphoRecords, fungalRecords, climateRecords) => {
  const wb = XLSX.utils.book_new();

  // 1. Hoja: Resumen Ejecutivo
  const totalMorpho = morphoRecords.length;
  const avgHeight = totalMorpho > 0 ? (morphoRecords.reduce((acc, r) => acc + Number(r.height || 0), 0) / totalMorpho).toFixed(2) : '0';
  const avgDiameter = totalMorpho > 0 ? (morphoRecords.reduce((acc, r) => acc + Number(r.diameter || 0), 0) / totalMorpho).toFixed(2) : '0';
  const avgLeaves = totalMorpho > 0 ? (morphoRecords.reduce((acc, r) => acc + Number(r.leaves || 0), 0) / totalMorpho).toFixed(2) : '0';
  const uniqueBlocksCount = new Set(morphoRecords.map(r => r.blockId || 'Sin Bloque')).size;

  const summaryData = [
    ['SISTEMA AGRONÓMICO Y LABORATOIAL - AGRONAVI OS'],
    ['REPORTE DE CAMPO, ENSAYO AGRONÓMICO Y SALUD DE SUELO'],
    ['Fecha de Exportación:', new Date().toLocaleString('es-ES')],
    ['Capacidad de Plataforma:', 'Hasta 25,000 Muestras'],
    [''],
    ['MÉTRICA / MÓDULO', 'VALOR OBSERVADO / TOTAL', 'OBSERVACIONES'],
    ['Total Muestras Evaluadas', totalMorpho, `Registros morfológicos acumulados`],
    ['Total Bloques / Parcelas', uniqueBlocksCount, 'Bloques muestreados en ensayo'],
    ['Promedio Largo/Altura de Planta (cm)', `${avgHeight} cm`, 'Medición desde la base al ápice foliar'],
    ['Promedio Diámetro Basal (mm)', `${avgDiameter} mm`, 'Medición en cuello de raíz o tallo'],
    ['Promedio Conteo de Hojas', `${avgLeaves} hojas`, 'Hojas expandidas por planta'],
    ['Registros de Colonización Fúngica', fungalRecords.length, 'Micorrizas VAM y Trichoderma spp.'],
    ['Registros Agroclimáticos & Fitosanidad', climateRecords.length, 'Temperaturas, Precipitación y Severidad']
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 38 }, { wch: 28 }, { wch: 48 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen_Ejecutivo');

  // 2. Hoja: Parámetros Morfológicos (Datos Campo)
  const morphoSheetData = morphoRecords.map((r, index) => ({
    'N° Muestra': r.sampleNo || index + 1,
    'Bloque / Parcela': r.blockId || 'Bloque General',
    'Tratamiento': r.treatment || 'Control',
    'ID Planta / Etiqueta': r.plantId || `PLT-${String(index + 1).padStart(5, '0')}`,
    'Largo / Altura (cm)': Number(r.height || 0),
    'Diámetro Basal (mm)': Number(r.diameter || 0),
    'Número de Hojas': Number(r.leaves || 0),
    'Fecha Muestreo': r.date || new Date().toISOString().split('T')[0],
    'Observaciones / Notas': r.notes || '-'
  }));

  const wsMorpho = XLSX.utils.json_to_sheet(morphoSheetData);
  wsMorpho['!cols'] = [
    { wch: 12 }, 
    { wch: 18 }, 
    { wch: 22 }, 
    { wch: 22 }, 
    { wch: 20 }, 
    { wch: 20 }, 
    { wch: 16 }, 
    { wch: 16 }, 
    { wch: 32 }
  ];
  XLSX.utils.book_append_sheet(wb, wsMorpho, 'Datos_Morfológicos');

  // 3. Hoja: Colonización Fúngica (Datos Lab)
  const fungalSheetData = fungalRecords.map((r, index) => {
    const totalCuts = Number(r.totalCuts || 0);
    const micoCuts = Number(r.micoCuts || 0);
    const trichoCuts = Number(r.trichoCuts || 0);
    const micoPct = totalCuts > 0 ? ((micoCuts / totalCuts) * 100).toFixed(2) : '0.00';
    const trichoPct = totalCuts > 0 ? ((trichoCuts / totalCuts) * 100).toFixed(2) : '0.00';

    return {
      'N° Registro': index + 1,
      'Fecha Evaluada': r.date || new Date().toISOString().split('T')[0],
      'Muestra Radicular / Identificador': r.sampleName || `Raíz M-${index + 1}`,
      'Cortes Totales Evaluados (N)': totalCuts,
      'Cortes Presencia Micorrizas': micoCuts,
      '% Colonización Micorrízica (VAM)': `${micoPct}%`,
      'Cortes Presencia Trichoderma': trichoCuts,
      '% Presencia Trichoderma': `${trichoPct}%`,
      'Nivel de Colonización': Number(micoPct) >= 50 ? 'ALTO' : Number(micoPct) >= 20 ? 'MODERADO' : 'BAJO'
    };
  });

  const wsFungal = XLSX.utils.json_to_sheet(fungalSheetData);
  wsFungal['!cols'] = [
    { wch: 12 }, 
    { wch: 16 }, 
    { wch: 28 }, 
    { wch: 24 }, 
    { wch: 24 }, 
    { wch: 26 }, 
    { wch: 24 }, 
    { wch: 22 }, 
    { wch: 18 }
  ];
  XLSX.utils.book_append_sheet(wb, wsFungal, 'Colonización_Fúngica');

  // 4. Hoja: Clima y Fitosanidad
  const climateSheetData = climateRecords.map((r, index) => ({
    'N° Registro': index + 1,
    'Fecha Registro': r.date || new Date().toISOString().split('T')[0],
    'Temp. Mínima (°C)': Number(r.tempMin || 0),
    'Temp. Máxima (°C)': Number(r.tempMax || 0),
    'Temp. Promedio (°C)': Number(r.tempAvg || 0),
    'Precipitación / Lluvia (mm)': Number(r.rainMm || 0),
    'Enfermedad Foliar Observada': r.diseaseName || 'Sin síntomas',
    'Severidad / Escala': r.diseaseSeverity || 'Escala 0 (Sano 0%)',
    'Porcentaje Incidencia': r.diseasePct ? `${r.diseasePct}%` : '0%',
    'Notas Fitosanitarias': r.notes || '-'
  }));

  const wsClimate = XLSX.utils.json_to_sheet(climateSheetData);
  wsClimate['!cols'] = [
    { wch: 12 }, 
    { wch: 14 }, 
    { wch: 18 }, 
    { wch: 18 }, 
    { wch: 18 }, 
    { wch: 24 }, 
    { wch: 26 }, 
    { wch: 22 }, 
    { wch: 22 }, 
    { wch: 30 }
  ];
  XLSX.utils.book_append_sheet(wb, wsClimate, 'Clima_y_Fitosanidad');

  // Descargar libro Excel con nombre estandarizado
  const fileName = `AgroNavi_OS_Reporte_Agronomico_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
