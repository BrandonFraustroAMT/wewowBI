
let value = ((generoCountValue.length * 100)/ seguirDesarrollandomeFilteredCount.length)
  
        afirmacion[`seguirdesarrollandome_${dat}`] = `${((generoCountValue.length * 100)/ seguirDesarrollandomeFilteredCount.length).toFixed(0)}%`;
        
        generosUnicos.forEach(data2 => {
          const medioData = generoMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`genero_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        medioTransporteUnico.forEach(data2 => {
          const medioData = medioTransporteMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`mediotransporte_${data2}_${dat}`] = 
            `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        tiempoLlegadaUnico.forEach(data2 => {
          const medioData = tiempoLlegadaMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`tiempollegada_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        cantidadReunionesUnico.forEach(data2 => {
          const medioData = cantidadReunionesMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`reunionesjefe_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        oportunidadesMejoraUnico.forEach(data2 => {
          const medioData = oportunidadesMejoraMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`oportunidadesmejora_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        seguirDesarrollandomeUnico.forEach(data2 => {
          const medioData = seguirDesarrollandomeMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`seguirdesarrollandome_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        oportunidadesEmpleoUnico.forEach(data2 => {
          const medioData = oportunidadesEmpleoMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`oportunidadesempleo_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        cantidadEmpleosUnico.forEach(data2 => {
          const medioData = cantidadEmpleosMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`cantidadempleos_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        padecimientoSaludUnico.forEach(data2 => {
          const medioData = padecimientoSaludMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`padecimientosalud_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        dependientesEconomicosUnico.forEach(data2 => {
          const medioData = dependientesEconomicosMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`dependienteseconomicos_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        tiempoGenteACargoUnico.forEach(data2 => {
          const medioData = tiempoGenteACargoMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`tiempogente_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        modalidadTrabajoUnico.forEach(data2 => {
          const medioData = modalidadTrabajoMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`modalidatrabajo_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        describirOrganizacionUnico.forEach(data2 => {
          const medioData = describirOrganizacionMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`describirorganizacion_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        areaUnico.forEach(data2 => {
          const medioData = areaMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`areaT_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        cargoUnico.forEach(data2 => {
          const medioData = cargoMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bdbdo10id.bdid));
          afirmacion[`cargoT_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        cargoMologadoUnico.forEach(data2 => {
          const medioData = cargoMologadoMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bdbdo10id.bdid));
          afirmacion[`cargomologado_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        educacionUnico.forEach(data2 => {
          const medioData = educacionMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`educacion_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        generacionUnico.forEach(data2 => {
          const medioData = generacionMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`generacion_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        nivelE1Unico.forEach(data2 => {
          const medioData = nivelE1Map[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`nivele1_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        nivelE2Unico.forEach(data2 => {
          const medioData = nivelE2Map[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`nivele2_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        nivelE3Unico.forEach(data2 => {
          const medioData = nivelE3Map[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`nivele3_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        nivelE4Unico.forEach(data2 => {
          const medioData = nivelE4Map[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`nivele4_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        nivelE5Unico.forEach(data2 => {
          const medioData = nivelE5Map[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`nivele5_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        nivelE6Unico.forEach(data2 => {
          const medioData = nivelE6Map[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`nivele6_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        nivelE7Unico.forEach(data2 => {
          const medioData = nivelE7Map[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`nivele7_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        nivelE8Unico.forEach(data2 => {
          const medioData = nivelE8Map[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`nivele8_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        nivelE9Unico.forEach(data2 => {
          const medioData = nivelE9Map[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`nivele9_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        nivelE10Unico.forEach(data2 => {
          const medioData = nivelE10Map[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`nivele10_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        paisUnico.forEach(data2 => {
          const medioData = paisMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`pais_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        localidad1Unico.forEach(data2 => {
          const medioData = localidad1Map[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`local1_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        localidad2Unico.forEach(data2 => {
          const medioData = localidad2Map[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bid.bdinfid));
          afirmacion[`local2_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
        lideresUnico.forEach(data2 => {
          const medioData = lideresMap[data2] || [];
          const filtered = medioData.filter(item => idsPorMedioTransporte.includes(item.bdbdo10id.bdid));
          afirmacion[`tiempollegada_${data2}_${dat}`] = `${(((filtered.length*100)/seguirDesarrollandomeFilteredCount.length)*100/value).toFixed(0)}%`;
        });
