<template>
    <div class="tabla_container">
      <v-data-table-virtual
      :headers="headers"
      height="550"
      :items="formattedData"
      item-value="name"
      >
        <template v-slot:item="{ item }">
          <tr>
            <!-- Columnas estáticas -->
            <td v-for="header in headers" :key="header.key">
              <span>{{ item[header.key] || '-' }}</span> <!-- Muestra '-' si no hay valor -->
            </td>
          </tr>
        </template>
        <!-- Slot para cuando no hay datos -->
        <template v-slot:no-data>
          <tr>
            <td colspan="100%" class="text-center">
              Cargando datos.
            </td>
          </tr>
        </template>
      </v-data-table-virtual>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import * as XLSX from 'xlsx';
  import { useRoute } from '#app';
  
  import empresasService from '~/services/Empresas';
  import dimensionesService from '~/services/Dimensiones';
  import respuestasService from '~/services/Respuestas';
  import condensadoDimensionesService from '~/services/CondensadoDimensiones';
  import bdbd010Service from '~/services/Bdbd010';
  
  
  // Recibir la prop filterData
  const props = defineProps({
    filterData: {
      type: Object,
      default: () => ({})
    }
  });
  
  
  const getItemValue = (item, key) => {
    // Mapea el key del header al valor correspondiente en el item
    switch(key) {
      case 'resultado':
        return item.resultado;
      case 'val1':
        return item.val1;
      case 'val2':
        return item.val2;
      case 'val3':
        return item.val3;
      case 'val4':
        return item.val4;
      case 'val5':
        return item.val5;
      default:
        // Para los headers dinámicos
        return item[key] || '';
    }
  }
  
  
  // Variables reactivas
  const empresa = ref<number>(0);
  const mod = ref<number>(0);
  const sub = ref<number>(0);
  const tokenPayload = ref<any>(null);
  const empresaData:any = ref({});
  const tableData:any = ref([]);
  const formattedData:any = ref([]);
  const expandedRows = ref(new Set<number | string>());
  const selectedLevels = ref<string[]>([]);
  const respuestasData:any = ref([]);
  const bdbd010Data:any = ref([]);
  const benchmark1 =  ref<number>(0);
  const benchmark2 =  ref<number>(0);
  const benchmark3 =  ref<number>(0);
  const benchmark4 =  ref<number>(0);
  const benchmark5 =  ref<number>(0);
  const benchmark6 =  ref<number>(0);
  const benchmark7 =  ref<number>(0);
  const benchmark8 =  ref<number>(0);
  const benchmark9 =  ref<number>(0);
  const benchmark10 =  ref<number>(0);
  
  const cantidadRespuestas = ref<number>(0);
  
  
  /* VARIABLRES PARA LOS DEMOGRÁFICOS */
  const generos:any = ref({});
  const generosCount:any = ref({});
  
  const medioTransporte:any = ref({});
  const medioTransporteCount:any = ref({});
  
  const tiempoLlegada:any = ref({});
  const tiempoLlegadaCount:any = ref({});
  
  const cantidadReuniones:any = ref({});
  const cantidadReunionesCount:any = ref({});
  
  const oportunidadesMejora:any = ref({});
  const oportunidadesMejoraCount:any = ref({});
  
  const seguirDesarrollandome:any = ref({});
  const seguirDesarrollandomeCount:any = ref({});
  
  const oportunidadesEmpleo:any = ref({});
  const oportunidadesEmpleoCount:any = ref({});
  
  const cantidadEmpleos:any = ref({});
  const cantidadEmpleosCount:any = ref({});
  
  const padecimientoSalud:any = ref({});
  const padecimientoSaludCount:any = ref({});
  
  const dependientesEconomicos:any = ref({});
  const dependientesEconomicosCount:any = ref({});
  
  const tiempoGenteACargo:any = ref({});
  const tiempoGenteACargoCount:any = ref({});
  
  const modalidadTrabajo:any = ref({});
  const modalidadTrabajoCount:any = ref({});
  
  const describirOrganizacion:any = ref({});
  const describirOrganizacionCount:any = ref({});
  
  const añosTrabajo:any = ref({});
  
  const area:any = ref({});
  
  const cargo:any = ref({});
  
  const cargoMologado:any = ref({});
  
  const educacion:any = ref({});
  
  const generacion:any = ref({});
  
  const localidad1:any = ref({});
  
  const localidad2:any = ref({});
  
  const nivelEstructural1:any = ref({});
  
  const nivelEstructural2:any = ref({});
  
  const nivelEstructural3:any = ref({});
  
  const nivelEstructural4:any = ref({});
  
  const nivelEstructural5:any = ref({});
  
  const nivelEstructural6:any = ref({});
  
  const nivelEstructural7:any = ref({});
  
  const nivelEstructural8:any = ref({});
  
  const nivelEstructural9:any = ref({});
  
  const nivelEstructural10:any = ref({});
  
  const pais:any = ref({});
  
  
  const lideres:any = ref({});
  const lideresCount:any = ref({});
  
  const demografic:any = ref({});
  const demograficCount:any = ref({});
  
  const pregAbiertas:any = ref({});
  const pregAbiertasCount:any = ref({});
  
  let overallResult = ref(0);
  
  
  let generosUnicos: string[] = [];
  let medioTransporteUnico: string[] = [];
  let tiempoLlegadaUnico: string[] = [];
  let cantidadReunionesUnico: string[] = [];
  let oportunidadesMejoraUnico: string[] = [];
  let seguirDesarrollandomeUnico: string[] = [];
  let oportunidadesEmpleoUnico: string[] = [];
  let cantidadEmpleosUnico: string[] = [];
  let padecimientoSaludUnico: string[] = [];
  let dependientesEconomicosUnico: string[] = [];
  let tiempoGenteACargoUnico: string[] = [];
  let modalidadTrabajoUnico: string[] = [];
  let describirOrganizacionUnico: string[] = [];
  let añosTrabajoUnico: string[] = [];
  let areaUnico: string[] = [];
  let cargoUnico: string[] = [];
  let cargoMologadoUnico: string[] = [];
  let educacionUnico: string[] = [];
  let generacionUnico: string[] = [];
  let localidad1Unico: string[] = [];
  let localidad2Unico: string[] = [];
  let nivelE1Unico: string[] = [];
  let nivelE2Unico: string[] = [];
  let nivelE3Unico: string[] = [];
  let nivelE4Unico: string[] = [];
  let nivelE5Unico: string[] = [];
  let nivelE6Unico: string[] = [];
  let nivelE7Unico: string[] = [];
  let nivelE8Unico: string[] = [];
  let nivelE9Unico: string[] = [];
  let nivelE10Unico: string[] = [];
  let paisUnico: string[] = [];
  let pregAbUnico: string[] = [];
  
  let generoMap: { [key: string]: any[] } = {};
  let medioTransporteMap: { [key: string]: any[] } = {};
  let tiempoLlegadaMap: { [key: string]: any[] } = {};
  let cantidadReunionesMap: { [key: string]: any[] } = {};
  let oportunidadesMejoraMap: { [key: string]: any[] } = {};
  let seguirDesarrollandomeMap: { [key: string]: any[] } = {};
  let oportunidadesEmpleoMap: { [key: string]: any[] } = {};
  let cantidadEmpleosMap: { [key: string]: any[] } = {};
  let padecimientoSaludMap: { [key: string]: any[] } = {};
  let dependientesEconomicosMap: { [key: string]: any[] } = {};
  let tiempoGenteACargoMap: { [key: string]: any[] } = {};
  let modalidadTrabajoMap: { [key: string]: any[] } = {};
  let describirOrganizacionMap: { [key: string]: any[] } = {};
  let añosTrabajoMap: { [key: string]: any[] } = {};
  let areaMap: { [key: string]: any[] } = {};
  let cargoMap: { [key: string]: any[] } = {};
  let cargoMologadoMap: { [key: string]: any[] } = {};
  let educacionMap: { [key: string]: any[] } = {};
  let generacionMap: { [key: string]: any[] } = {};
  let localidad1Map: { [key: string]: any[] } = {};
  let localidad2Map: { [key: string]: any[] } = {};
  let nivelE1Map: { [key: string]: any[] } = {};
  let nivelE2Map: { [key: string]: any[] } = {};
  let nivelE3Map: { [key: string]: any[] } = {};
  let nivelE4Map: { [key: string]: any[] } = {};
  let nivelE5Map: { [key: string]: any[] } = {};
  let nivelE6Map: { [key: string]: any[] } = {};
  let nivelE7Map: { [key: string]: any[] } = {};
  let nivelE8Map: { [key: string]: any[] } = {};
  let nivelE9Map: { [key: string]: any[] } = {};
  let nivelE10Map: { [key: string]: any[] } = {};
  let paisMap: { [key: string]: any[] } = {};
  let pregAbMap: { [key: string]: any[] } = {};
  
  const filtroPais:any = ref();
  const filtroLocalidad1:any = ref();
  const filtroLocalidad2:any = ref();
  // Función para obtener los datos de la empresa por ID
  const empresafounded = async (id: number) => {
    if (id) {
      const data = await empresasService.getEmpresaId(id);
      empresaData.value = data;
    }
  };
  
  watch(() => props.filterData, (newFilterData) => {
    filtroPais.value = newFilterData?.pais
    filtroLocalidad1.value = newFilterData?.localidad1
    filtroLocalidad2.value = newFilterData?.localidad2

    const { pais, localidad1, localidad2 } = newFilterData || {};

    // Aplicamos los filtros sobre la data
    if (pais) {
      bdbd010Data.value = bdbd010Data.value.filter((bd: any) => bd.bdcont === pais);
      respuestasData.value = respuestasData.value.filter((bd: any) => bd.bdinfcont === pais);
    } else if (localidad1) {
      bdbd010Data.value = bdbd010Data.value.filter((bd: any) => bd.bdlocal === localidad1);
      respuestasData.value = respuestasData.value.filter((bd: any) => bd.bdinflocal === localidad1);
    } else if (localidad2) {
      bdbd010Data.value = bdbd010Data.value.filter((bd: any) => bd.bdlocalb === localidad2);
      respuestasData.value = respuestasData.value.filter((bd: any) => bd.bdinflocalb === localidad2);
    } else {
      // Si no hay filtros, restauramos los datos originales
      bdbd010Data.value = bdbd010Data.value;
      respuestasData.value = respuestasData.value;
    }
  },{ immediate: true });

  // Función para obtener las respuestas por ID de empresa y los demográficos
  const answersFounded = async (id: number) => {
    if (id) {
      const dataAnswers = await respuestasService.getAnswersID(id);
      const bdbd010Demo = await bdbd010Service.getBdbd010ByEmp(id);
      /* const desvEstData = await condensadoDimensionesService.getCondensadoDimensionsByEmp(id); */
      const dataDimensions = await dimensionesService.getDimensionsByEmp(id);
  
      bdbd010Data.value = bdbd010Demo;
      respuestasData.value = dataAnswers;
      
      /* DIMENSIONES */
      const contentTable = respuestasData.value.filter((rd:any) => rd.bid.bdinfdimid >= 2 && rd.bid.bdinfdimid <= 4);
      
      /* LIDERES */
      lideres.value = bdbd010Data.value.filter((bd:any) => bd.bdcargoho === 'Jefe de Área o Supervisores' || 
        bd.bdcargoho === 'C Level' || bd.bdcargoho === 'Gerente o SubGerente');
  
      /* PREGUNTAS ABIERTAS */
      pregAbiertas.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfdimid === 5);
  
      //cantidad de respuestas
      cantidadRespuestas.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 1).length;
      
      /* DEMOGRÁFICOS */
      generos.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 1);
      generosCount.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 2 && rd.bid.bdinfidindn == 1);
  
      medioTransporte.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 2);
      medioTransporteCount.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 2 && rd.bid.bdinfidindn == 1);
  
      tiempoLlegada.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 3);
      tiempoLlegadaCount.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 2 && rd.bid.bdinfidindn == 1);
      
      cantidadReuniones.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 4);
      cantidadReunionesCount.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 2 && rd.bid.bdinfidindn == 1);
  
      oportunidadesMejora.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 5);
      oportunidadesMejoraCount.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 2 && rd.bid.bdinfidindn == 1);
  
      seguirDesarrollandome.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 6);
      seguirDesarrollandomeCount.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 2 && rd.bid.bdinfidindn == 1);
  
      oportunidadesEmpleo.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 7);
      oportunidadesEmpleoCount.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 2 && rd.bid.bdinfidindn == 1);
  
      cantidadEmpleos.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 8);
      cantidadEmpleosCount.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 2 && rd.bid.bdinfidindn == 1);
  
      padecimientoSalud.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 9);
      padecimientoSaludCount.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 2 && rd.bid.bdinfidindn == 1);
  
      dependientesEconomicos.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 10);
      dependientesEconomicosCount.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 2 && rd.bid.bdinfidindn == 1);
  
      tiempoGenteACargo.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 11);
      tiempoGenteACargoCount.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 2 && rd.bid.bdinfidindn == 1);
  
      modalidadTrabajo.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 12);
      modalidadTrabajoCount.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 2 && rd.bid.bdinfidindn == 1);
  
      describirOrganizacion.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 13);
      describirOrganizacionCount.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 2 && rd.bid.bdinfidindn == 1);
  
      const dataRespuestas = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 1)// VARIABLE PARA MANEJAR LOS AÑOS DE TRABAJO
  
      añosTrabajo.value = dataRespuestas.map((dr: any) => calculateYears(dr.bdinfantiguedad));// VARIABLE PARA CALCULAR LOS AÑOS DE TRABAJO
      area.value = dataRespuestas.map((dr:any) => dr.bdinfarea);
      cargo.value = bdbd010Data.value.map((bdbd:any) => bdbd.bdcargo);
      cargoMologado.value = bdbd010Data.value.map((bdbd:any) => bdbd.bdcargoho);
      educacion.value = dataRespuestas.map((dr:any) => dr.bdinfgradac);
      generacion.value = dataRespuestas.map((dr:any) => dr.bdinfgenracion);
      nivelEstructural1.value = dataRespuestas.map((dr:any) => dr.bdinfjer1);
      nivelEstructural2.value = dataRespuestas.map((dr:any) => dr.bdinfjer2);
      nivelEstructural3.value = dataRespuestas.map((dr:any) => dr.bdinfjer3);
      nivelEstructural4.value = dataRespuestas.map((dr:any) => dr.bdinfjer4);
      nivelEstructural5.value = dataRespuestas.map((dr:any) => dr.bdinfjer5);
      nivelEstructural6.value = dataRespuestas.map((dr:any) => dr.bdinfjer6);
      nivelEstructural7.value = dataRespuestas.map((dr:any) => dr.bdinfjer7);
      nivelEstructural8.value = dataRespuestas.map((dr:any) => dr.bdinfjer8);
      nivelEstructural9.value = dataRespuestas.map((dr:any) => dr.bdinfjer9);
      nivelEstructural10.value = dataRespuestas.map((dr:any) => dr.bdinfjer10);
      localidad1.value = dataRespuestas.map((dr:any) => dr.bdinflocal);
      localidad2.value = dataRespuestas.map((dr:any) => dr.bdinflocalb);
      pais.value = dataRespuestas.map((dr:any) => dr.bdinfcont);
  
      //DESVIACION ESTANDAR Y BENCHMARKS
      /* benchmark1.value = desvEstData[0].benchmark1;
      benchmark2.value = desvEstData[0].benchmark2;
      benchmark3.value = desvEstData[0].benchmark3;
      benchmark4.value = desvEstData[0].benchmark4;
      benchmark5.value = desvEstData[0].benchmark5;
      benchmark6.value = desvEstData[0].benchmark6;
      benchmark7.value = desvEstData[0].benchmark7;
      benchmark8.value = desvEstData[0].benchmark8;
      benchmark9.value = desvEstData[0].benchmark9;
      benchmark10.value = desvEstData[0].benchmark10; */
  
  
      generosUnicos = [...new Set(generos.value.map((gen: any) => gen.bdinfindxvc))];
      generosUnicos.forEach(genero => {
        generoMap[genero] = generos.value.filter((gen: any) => gen.bdinfindxvc === genero);
      });
  
      medioTransporteUnico = [...new Set(medioTransporte.value.map((mt:any) => mt.bdinfindxvc))];
      medioTransporteUnico.forEach(mt => {
        medioTransporteMap[mt] = medioTransporte.value.filter((mtu: any) => mtu.bdinfindxvc === mt);
      });
  
      tiempoLlegadaUnico = [...new Set(tiempoLlegada.value.map((tl:any) => tl.bdinfindxvc))];
      tiempoLlegadaUnico.forEach(tll => {
        tiempoLlegadaMap[tll] = tiempoLlegada.value.filter((tllu: any) => tllu.bdinfindxvc === tll);
      });
  
      cantidadReunionesUnico = [...new Set(cantidadReuniones.value.map((cr:any) => cr.bdinfindxvc))];
      cantidadReunionesUnico.forEach(crm => {
        cantidadReunionesMap[crm] = cantidadReuniones.value.filter((cr: any) => cr.bdinfindxvc === crm);
      });
  
      oportunidadesMejoraUnico = [...new Set(oportunidadesMejora.value.map((om:any) => om.bdinfindxvc))];
      oportunidadesMejoraUnico.forEach(omu => {
        oportunidadesMejoraMap[omu] = oportunidadesMejora.value.filter((om: any) => om.bdinfindxvc === omu);
      });
  
      seguirDesarrollandomeUnico = [...new Set(seguirDesarrollandome.value.map((mt:any) => mt.bdinfindxvc))];
      seguirDesarrollandomeUnico.forEach(sdu => {
        seguirDesarrollandomeMap[sdu] = seguirDesarrollandome.value.filter((sd: any) => sd.bdinfindxvc === sdu);
      });
  
      oportunidadesEmpleoUnico = [...new Set(oportunidadesEmpleo.value.map((mt:any) => mt.bdinfindxvc))];
      oportunidadesEmpleoUnico.forEach(oeu => {
        oportunidadesEmpleoMap[oeu] = oportunidadesEmpleo.value.filter((sd: any) => sd.bdinfindxvc === oeu);
      });
  
      cantidadEmpleosUnico = [...new Set(cantidadEmpleos.value.map((mt:any) => mt.bdinfindxvc))];
      cantidadEmpleosUnico.forEach(ceu => {
        cantidadEmpleosMap[ceu] = cantidadEmpleos.value.filter((ce: any) => ce.bdinfindxvc === ceu);
      });
  
      padecimientoSaludUnico = [...new Set(padecimientoSalud.value.map((mt:any) => mt.bdinfindxvc))];
      padecimientoSaludUnico.forEach(psu => {
        padecimientoSaludMap[psu] = padecimientoSalud.value.filter((ps: any) => ps.bdinfindxvc === psu);
      });
  
      dependientesEconomicosUnico = [...new Set(dependientesEconomicos.value.map((mt:any) => mt.bdinfindxvc))];
      dependientesEconomicosUnico.forEach(psu => {
        dependientesEconomicosMap[psu] = dependientesEconomicos.value.filter((ps: any) => ps.bdinfindxvc === psu);
      });
  
      tiempoGenteACargoUnico = [...new Set(tiempoGenteACargo.value.map((mt:any) => mt.bdinfindxvc))];
      tiempoGenteACargoUnico.forEach(psu => {
        tiempoGenteACargoMap[psu] = tiempoGenteACargo.value.filter((ps: any) => ps.bdinfindxvc === psu);
      });
  
      modalidadTrabajoUnico = [...new Set(modalidadTrabajo.value.map((mt:any) => mt.bdinfindxvc))];
      modalidadTrabajoUnico.forEach(psu => {
        modalidadTrabajoMap[psu] = modalidadTrabajo.value.filter((ps: any) => ps.bdinfindxvc === psu);
      });
  
      describirOrganizacionUnico = [...new Set(describirOrganizacion.value.map((mt:any) => mt.bdinfindxvc))];
      describirOrganizacionUnico.forEach(psu => {
        describirOrganizacionMap[psu] = describirOrganizacion.value.filter((ps: any) => ps.bdinfindxvc === psu);
      });
  
      añosTrabajoUnico = [...new Set(añosTrabajo.value.map((mt:any) => mt.bdinfindxvc))];
  
      areaUnico = [...new Set(area.value.map((mt:any) => mt))];
      areaUnico.forEach(psu => {
        areaMap[psu] = dataRespuestas.filter((ps: any) => ps.bdinfarea === psu);
      });
  
      cargoUnico = [...new Set(cargo.value.map((mt:any) => mt))];
      cargoUnico.forEach(psu => {
        cargoMap[psu] = bdbd010Data.value.filter((ps: any) => ps.bdcargo === psu);
      });
  
      cargoMologadoUnico = [...new Set(cargoMologado.value.map((mt:any) => mt))];
      cargoMologadoUnico.forEach(psu => {
        cargoMologadoMap[psu] = bdbd010Data.value.filter((ps: any) => ps.bdcargoho === psu);
      });
  
      educacionUnico = [...new Set(educacion.value.map((mt:any) => mt))];
      educacionUnico.forEach(psu => {
        educacionMap[psu] = dataRespuestas.filter((ps: any) => ps.bdinfgradac === psu);
      });
  
      generacionUnico = [...new Set(generacion.value.map((mt:any) => mt))];
      generacionUnico.forEach(psu => {
        generacionMap[psu] = dataRespuestas.filter((ps: any) => ps.bdinfgenracion === psu);
      });
  
      nivelE1Unico = [...new Set(nivelEstructural1.value.filter((mt: any) => mt !== 'VACANTE').map((mt:any) => mt))];
      nivelE1Unico.forEach(psu => {
        nivelE1Map[psu] = dataRespuestas.filter((ps: any) => ps.bdinfjer1 === psu);
      });
  
      nivelE2Unico = [...new Set(nivelEstructural2.value.filter((mt: any) => mt !== 'VACANTE').map((mt:any) => mt))];
      nivelE2Unico.forEach(psu => {
        nivelE2Map[psu] = dataRespuestas.filter((ps: any) => ps.bdinfjer2 === psu);
      });
  
      nivelE3Unico = [...new Set(nivelEstructural3.value.filter((mt: any) => mt !== 'VACANTE').map((mt:any) => mt))];
      nivelE3Unico.forEach(psu => {
        nivelE3Map[psu] = dataRespuestas.filter((ps: any) => ps.bdinfjer3 === psu);
      });
  
      nivelE4Unico = [...new Set(nivelEstructural4.value.filter((mt: any) => mt !== 'VACANTE').map((mt:any) => mt))];
      nivelE4Unico.forEach(psu => {
        nivelE4Map[psu] = dataRespuestas.filter((ps: any) => ps.bdinfjer4 === psu);
      });
  
      nivelE5Unico = [...new Set(nivelEstructural5.value.filter((mt: any) => mt !== 'VACANTE').map((mt:any) => mt))];
      nivelE5Unico.forEach(psu => {
        nivelE5Map[psu] = dataRespuestas.filter((ps: any) => ps.bdinfjer5 === psu);
      });
  
      nivelE6Unico = [...new Set(nivelEstructural6.value.filter((mt: any) => mt !== 'VACANTE').map((mt:any) => mt))];
      nivelE6Unico.forEach(psu => {
        nivelE6Map[psu] = dataRespuestas.filter((ps: any) => ps.bdinfjer6 === psu);
      });
      
      nivelE7Unico = [...new Set(nivelEstructural7.value.filter((mt: any) => mt !== 'VACANTE').map((mt:any) => mt))];
      nivelE7Unico.forEach(psu => {
        nivelE7Map[psu] = dataRespuestas.filter((ps: any) => ps.bdinfjer7 === psu);
      });
  
      nivelE8Unico = [...new Set(nivelEstructural8.value.filter((mt: any) => mt !== 'VACANTE').map((mt:any) => mt))];
      nivelE8Unico.forEach(psu => {
        nivelE8Map[psu] = dataRespuestas.filter((ps: any) => ps.bdinfjer8 === psu);
      });
  
      nivelE9Unico = [...new Set(nivelEstructural9.value.filter((mt: any) => mt !== 'VACANTE').map((mt:any) => mt))];
      nivelE9Unico.forEach(psu => {
        nivelE9Map[psu] = dataRespuestas.filter((ps: any) => ps.bdinfjer9 === psu);
      });
  
      nivelE10Unico = [...new Set(nivelEstructural10.value.filter((mt: any) => mt !== 'VACANTE').map((mt:any) => mt))];
      nivelE10Unico.forEach(psu => {
        nivelE10Map[psu] = dataRespuestas.filter((ps: any) => ps.bdinfjer10 === psu);
      });
  
      paisUnico = [...new Set(pais.value.filter((mt: any) => mt !== 'VACANTE').map((mt:any) => mt))];
      paisUnico.forEach(psu => {
        paisMap[psu] = dataRespuestas.filter((ps: any) => ps.bdinfcont === psu);
      });
  
      localidad1Unico = [...new Set(localidad1.value.filter((mt: any) => mt !== 'VACANTE').map((mt:any) => mt))];
      localidad1Unico.forEach(psu => {
        localidad1Map[psu] = dataRespuestas.filter((ps: any) => ps.bdinflocal === psu);
      });
  
      localidad2Unico = [...new Set(localidad2.value.filter((mt: any) => mt !== 'VACANTE').map((mt:any) => mt))];
      localidad2Unico.forEach(psu => {
        localidad2Map[psu] = dataRespuestas.filter((ps: any) => ps.bdinflocalb === psu);
      });

      pregAbUnico = [
        "Qué es lo más WOW de trabajar en tu organización?",
        "Qué es lo menos WOW de trabajar en tu organización?",
        "¿Si tu empresa fuera un vehículo que vehículo sería?", 
        "Menciona 3 características que explican porque tu organización sería ese vehículo."
      ];
      pregAbUnico.forEach((psu, index) => {
        pregAbMap[psu] = pregAbiertas.value.filter((ps: any) => ps.bid.bdinfidindn === (index+1));
      });
  
      tableData.value = transformData(
        pregAbMap, pregAbUnico,
      );
      updateFormattedData();
    }
  };
  
  const headers = ref([
    { title: 'Preguntas', sortable: false, key: 'pregunta' },
  ]);
  
  watch(() => props.filterData.columns, (newColumns) => {
    if (newColumns) {
      let dynamicHeaders = [];
      if (newColumns.map(nc => nc.name).includes('¿Qué es lo más WOW de trabajar en tu organización?')) {
            dynamicHeaders.push({
                title: '¿Qué es lo más WOW de trabajar en tu organización?',
                sortable: false,
                key: `preguntasab_Qué es lo más WOW de trabajar en tu organización?`,
            });
      }
      if (newColumns.map(nc => nc.name).includes('¿Qué es lo menos WOW de trabajar en tu organización?')) {
            dynamicHeaders.push({
                title: '¿Qué es lo menos WOW de trabajar en tu organización?',
                sortable: false,
                key: `preguntasab_Qué es lo menos WOW de trabajar en tu organización?`,
            });
      }
      if (newColumns.map(nc => nc.name).includes('Si tu empresa fuera un vehiculo ¿Qué vehiculo seria?')) {
            dynamicHeaders.push({
                title: 'Si tu empresa fuera un vehiculo ¿Qué vehiculo seria?',
                sortable: false,
                key: `preguntasab_¿Si tu empresa fuera un vehículo que vehículo sería?`,
            });
      }
      if (newColumns.map(nc => nc.name).includes('Menciona 3 caracteristicas que explican porque tu organización sería ese vehiculo.')) {
            dynamicHeaders.push({
                title: 'Menciona 3 caracteristicas que explican porque tu organización sería ese vehiculo.',
                sortable: false,
                key: `preguntasab_Menciona 3 características que explican porque tu organización sería ese vehículo.`,
            });
      }
      // Verifica si 'generos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Genero')) {
        dynamicHeaders.push({
            title: 'Género',
            align: 'center',
            key: 'generos-header',
            colspan: generosUnicos.length,
        });
  
        generosUnicos.forEach((genero, index) => {
            dynamicHeaders.push({
                title: genero,
                sortable: false,
                key: `genero_${genero}`,
            });
        });
      }
  
      // Verifica si 'Medio de transporte' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Medio de transporte')) {
        dynamicHeaders.push({
            title: 'Medio de transporte',
            align: 'center',
            key: 'mediotransporte-header',
            colspan: medioTransporteUnico.length,
        });
        
        medioTransporteUnico.forEach((mt, index) => {
            dynamicHeaders.push({
                title: mt,
                sortable: false,
                key: `mediotransporte_${mt}`,
            });
        });
      }
  
      // Verifica si 'Tiempo de llegada' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Tiempo de llegada')) {
        dynamicHeaders.push({
            title: 'Tiempo de llegada',
            align: 'center',
            key: 'tiempollegada-header',
            colspan: tiempoLlegadaUnico.length,
        });
        
        tiempoLlegadaUnico.forEach((tll, index) => {
            dynamicHeaders.push({
                title: tll,
                sortable: false,
                key: `tiempollegada_${tll}`,
            });
        });
      }
  
      // Verifica si 'Reuniones con tu jefe' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Reuniones con tu jefe')) {
        dynamicHeaders.push({
            title: 'Reuniones con tu jefe',
            align: 'center',
            key: 'reunionesjefe-header',
            colspan: cantidadReunionesUnico.length,
        });
        
        cantidadReunionesUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `reunionesjefe_${cru}`,
            });
        });
      }
  
      // Verifica si 'Oportunidades' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Oportunidades')) {
        dynamicHeaders.push({
            title: 'Oportunidades de Mejora',
            align: 'center',
            key: 'oportunidadesmejora-header',
            colspan: oportunidadesMejoraUnico.length,
        });
        
        oportunidadesMejoraUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `oportunidadesmejora_${cru}`,
            });
        });
      }
      // Verifica si 'Seguir desarrollandome' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Seguir desarrollandome')) {
        dynamicHeaders.push({
            title: 'Seguir desarrollandome',
            align: 'center',
            key: 'seguirdesarrollandome-header',
            colspan: seguirDesarrollandomeUnico.length,
        });
        
        seguirDesarrollandomeUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `seguirdesarrollandome_${cru}`,
            });
        });
      }
      // Verifica si 'Buscar oportunidades de empleo' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Buscar oportunidades de empleo')) {
        dynamicHeaders.push({
            title: 'Oportunidades de Empleo',
            align: 'center',
            key: 'oportunidadesempleo-header',
            colspan: oportunidadesEmpleoUnico.length,
        });
        
        oportunidadesEmpleoUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `oportunidadesempleo_${cru}`,
            });
        });
      }
      // Verifica si 'Cantidad de empleos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Cantidad de empleos')) {
        dynamicHeaders.push({
            title: 'Cantidad de empleos',
            align: 'center',
            key: 'cantidadempleos-header',
            colspan: cantidadEmpleosUnico.length,
        });
        
        cantidadEmpleosUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `cantidadempleos_${cru}`,
            });
        });
      }
      // Verifica si 'Cantidad de empleos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Padecimiento de salud crónico')) {
        dynamicHeaders.push({
            title: 'Padecimiento de salud crónico',
            align: 'center',
            key: 'padecimientosalud-header',
            colspan: padecimientoSaludUnico.length,
        });
        
        padecimientoSaludUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `padecimientosalud_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Dependientes económicos')) {
        dynamicHeaders.push({
            title: 'Dependientes económicos',
            align: 'center',
            key: 'dependienteseconomicos-header',
            colspan: dependientesEconomicosUnico.length,
        });
        
        dependientesEconomicosUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `dependienteseconomicos_${cru}`,
            });
        });
      }
  
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Tiempo de gente a cargo')) {
        dynamicHeaders.push({
            title: 'Tiempo de gente a cargo',
            align: 'center',
            key: 'tiempogente-header',
            colspan: tiempoGenteACargoUnico.length,
        });
        
        tiempoGenteACargoUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `tiempogente_${cru}`,
            });
        });
      }
  
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Modalidad de trabajo')) {
        dynamicHeaders.push({
            title: 'Modalidad de trabajo',
            align: 'center',
            key: 'modalidatrabajo-header',
            colspan: modalidadTrabajoUnico.length,
        });
        
        modalidadTrabajoUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `modalidatrabajo_${cru}`,
            });
        });
      }
  
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Describir tu organización')) {
        dynamicHeaders.push({
            title: 'Describir tu organización',
            align: 'center',
            key: 'describirorganizacion-header',
            colspan: describirOrganizacionUnico.length,
        });
        
        describirOrganizacionUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `describirorganizacion_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Area')) {
        dynamicHeaders.push({
            title: 'Area',
            align: 'center',
            key: 'areaT-header',
            colspan: areaUnico.length,
        });
        
        areaUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `areaT_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Cargo')) {
        dynamicHeaders.push({
            title: 'Cargo',
            align: 'center',
            key: 'cargoT-header',
            colspan: cargoUnico.length,
        });
        
        cargoUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `cargoT_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Cargo mologado')) {
        dynamicHeaders.push({
            title: 'Cargo mologado',
            align: 'center',
            key: 'cargomologado-header',
            colspan: cargoMologadoUnico.length,
        });
        
        cargoMologadoUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `cargomologado_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Educación')) {
        dynamicHeaders.push({
            title: 'Educación',
            align: 'center',
            key: 'educacion-header',
            colspan: educacionUnico.length,
        });
        
        educacionUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `educacion_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Generación')) {
        dynamicHeaders.push({
            title: 'Generación',
            align: 'center',
            key: 'generacion-header',
            colspan: generacionUnico.length,
        });
        
        generacionUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `generacion_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Nivel estructural 1')) {
        dynamicHeaders.push({
            title: 'Nivel estructural 1',
            align: 'center',
            key: 'nivele1-header',
        });
        nivelE1Unico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `nivele1_${cru}`,
            });
        });
        
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Nivel estructural 2')) {
        dynamicHeaders.push({
            title: 'Nivel estructural 2',
            align: 'center',
            key: 'nivele2-header',
            colspan: nivelE2Unico.length,
        });

        nivelE2Unico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `nivele2_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Nivel estructural 3')) {
        dynamicHeaders.push({
            title: 'Nivel estructural 3',
            align: 'center',
            key: 'nivele3-header',
            colspan: nivelE3Unico.length,
        });
        nivelE3Unico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `nivele3_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Nivel estructural 4')) {
        dynamicHeaders.push({
            title: 'Nivel estructural 4',
            align: 'center',
            key: 'nivele4-header',
            colspan: nivelE4Unico.length,
        });
        nivelE4Unico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `nivele4_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Nivel estructural 5')) {
        dynamicHeaders.push({
            title: 'Nivel estructural 5',
            align: 'center',
            key: 'nivele5-header',
            colspan: nivelE5Unico.length,
        });
        nivelE5Unico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `nivele5_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Nivel estructural 6')) {
        dynamicHeaders.push({
            title: 'Nivel estructural 6',
            align: 'center',
            key: 'nivele6-header',
            colspan: nivelE6Unico.length,
        });
        nivelE6Unico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `nivele6_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Nivel estructural 7')) {
        dynamicHeaders.push({
            title: 'Nivel estructural 7',
            align: 'center',
            key: 'nivele7-header',
            colspan: nivelE7Unico.length,
        });
        nivelE7Unico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `nivele7_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Nivel estructural 8')) {
        dynamicHeaders.push({
            title: 'Nivel estructural 8',
            align: 'center',
            key: 'nivele8-header',
            colspan: nivelE8Unico.length,
        });
        nivelE8Unico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `nivele8_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Nivel estructural 9')) {
        dynamicHeaders.push({
            title: 'Nivel estructural 9',
            align: 'center',
            key: 'nivele9-header',
            colspan: nivelE9Unico.length,
        });
        nivelE9Unico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `nivele9_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Nivel estructural 10')) {
        dynamicHeaders.push({
            title: 'Nivel estructural 10',
            align: 'center',
            key: 'nivele10-header',
            colspan: nivelE10Unico.length,
        });
        nivelE10Unico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `nivele10_${cru}`,
            });
        });
      }
  
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Pais')) {
        dynamicHeaders.push({
            title: 'Pais',
            align: 'center',
            key: 'pais-header',
            colspan: paisUnico.length,
        });
        paisUnico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `pais_${cru}`,
            });
        });
      }
  
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Localidad 1')) {
        dynamicHeaders.push({
            title: 'Localidad 1',
            align: 'center',
            key: 'local1-header',
            colspan: localidad1Unico.length,
        });
        localidad1Unico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `local1_${cru}`,
            });
        });
      }
      // Verifica si 'Dependientes económicos' está en los nuevos columns
      if (newColumns.map(nc => nc.name).includes('Localidad 2')) {
        dynamicHeaders.push({
            title: 'Localidad 2',
            align: 'center',
            key: 'local2-header',
            colspan: localidad2Unico.length,
        });
        localidad2Unico.forEach((cru, index) => {
            dynamicHeaders.push({
                title: cru,
                sortable: false,
                key: `local2_${cru}`,
            });
        });
      }
  
      let valoresHeaders = [];
      if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
        valoresHeaders = props.filterData.valores.map((val, index) => {
          return {
            title: `Valor ${index + 1}`,
            sortable: false,
            key: `val${index + 1}`,
          };
        });
      }
  
      headers.value = [
        { title: 'Preguntas', sortable: false, key: 'pregunta' },
        ...dynamicHeaders,
      ];
    }
  }, { immediate: true });
  
  
  // Filtrar los datos según la selección
const applyFilter = () => {
  /* formattedData.value = [];
  selectedLevels.value = [];

  if (props.filterData && Array.isArray(props.filterData.rows)) {
    // Filtra datos basados en los géneros disponibles
    if (props.filterData.rows.some(nc => nc.name === 'Genero')) {
      formattedData.value.push({
        modelo: 'Géneros',
        expandable: false,
        isCategoryTitle: true
      });
      generosUnicos.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
  }else {
    console.error("filterData o filterData.rows no está definido o no es un array.");
  } */
};
  
  
  // Observa los cambios en filterData para aplicar el filtro automáticamente
  watch(() => props.filterData, applyFilter, { deep: true });
  
  // Función para transformar datos planos a la estructura jerárquica
  const transformData = (
        pregAbMap: { [key: string]: any[] }, pregAbUnico: string[],
    ): any[] => {
    const formatted: any[] = [];
    const addedItems = new Set();
    // Suponiendo que cada pregunta tiene la misma cantidad de respuestas 
    const rowCount = pregAbMap[pregAbUnico[0]].length;

    for (let i = 0; i < rowCount; i++) {
      // Creamos un objeto para cada fila
      const row: any = {
        modelo: `Modelo ${i + 1}`,  // Puedes ajustar este campo según tus datos
      };
    
      // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
      pregAbUnico.forEach((pregunta) => {
        const respuesta = pregAbMap[pregunta][i]?.bdinfindxvc || 'N/A';  
        row[`preguntasab_${pregunta}`] = respuesta;
      });

      // Añade los valores para los headers de 'Nivel estructural 1'
      nivelE1Unico.forEach((nivelEst) => {
        // Agrega los valores correspondientes a cada 'Nivel estructural 1' por fila
        let respuesta = {} 
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        pregAbUnico.forEach((pregunta) => {
          respuesta = pregAbMap[pregunta][i]?.bdinfjer1 || 'N/A';
        });
        row[`nivele1_${nivelEst}`] = respuesta;  // Aquí es donde asignas el valor de cada nivel estructural
      });


      nivelE2Unico.forEach((nivelEst) => {
        let respuesta = {}
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        pregAbUnico.forEach((pregunta) => {
          respuesta = pregAbMap[pregunta][i]?.bdinfjer2 || 'N/A';
        });
        row[`nivele2_${nivelEst}`] = respuesta;  
      });
      
      nivelE3Unico.forEach((nivelEst) => {
        let respuesta = {} 
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        pregAbUnico.forEach((pregunta) => {
          respuesta = pregAbMap[pregunta][i]?.bdinfjer3 || 'N/A';
        });
        row[`nivele3_${nivelEst}`] = respuesta;  
      });
      nivelE4Unico.forEach((nivelEst) => {
        let respuesta = {}; 
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        pregAbUnico.forEach((pregunta) => {
          respuesta = pregAbMap[pregunta][i]?.bdinfjer4 || 'N/A';
        });
        row[`nivele4_${nivelEst}`] = respuesta;  
      });
      nivelE5Unico.forEach((nivelEst) => {
        let respuesta = {}; 
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        pregAbUnico.forEach((pregunta) => {
          respuesta = pregAbMap[pregunta][i]?.bdinfjer5 || 'N/A';
        });
        row[`nivele5_${nivelEst}`] = respuesta;  
      });
      nivelE6Unico.forEach((nivelEst) => {
        let respuesta = {}; 
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        pregAbUnico.forEach((pregunta) => {
          respuesta = pregAbMap[pregunta][i]?.bdinfjer6 || 'N/A';
        });
        row[`nivele6_${nivelEst}`] = respuesta;  
      });
      nivelE7Unico.forEach((nivelEst) => {
        let respuesta = {}; 
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        pregAbUnico.forEach((pregunta) => {
          respuesta = pregAbMap[pregunta][i]?.bdinfjer7 || 'N/A';
        });
        row[`nivele7_${nivelEst}`] = respuesta;  
      });
      nivelE8Unico.forEach((nivelEst) => {
        let respuesta = {}; 
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        pregAbUnico.forEach((pregunta) => {
          respuesta = pregAbMap[pregunta][i]?.bdinfjer8 || 'N/A';
        });
        row[`nivele8_${nivelEst}`] = respuesta;  
      });
      nivelE9Unico.forEach((nivelEst) => {
        let respuesta = {}; 
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        pregAbUnico.forEach((pregunta) => {
          respuesta = pregAbMap[pregunta][i]?.bdinfjer9 || 'N/A';
        });
        row[`nivele9_${nivelEst}`] = respuesta;  
      });
      nivelE10Unico.forEach((nivelEst) => {
        let respuesta = {}; 
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        pregAbUnico.forEach((pregunta) => {
          respuesta = pregAbMap[pregunta][i]?.bdinfjer10 || 'N/A';
        });
        row[`nivele10_${nivelEst}`] = respuesta;  
      });
      localidad1Unico.forEach((nivelEst) => {
        let respuesta = {}; 
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        pregAbUnico.forEach((pregunta) => {
          respuesta = pregAbMap[pregunta][i]?.bdinflocal || 'N/A';
        });
        row[`local1_${nivelEst}`] = respuesta; 
      });
      localidad2Unico.forEach((nivelEst) => {
        let respuesta = {}; 
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        pregAbUnico.forEach((pregunta) => {
          respuesta = pregAbMap[pregunta][i]?.bdinflocalb || 'N/A';
        });
        row[`local2_${nivelEst}`] = respuesta;  
      });
      paisUnico.forEach((nivelEst) => {
        let respuesta = {}; 
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        pregAbUnico.forEach((pregunta) => {
          respuesta = pregAbMap[pregunta][i]?.bdinfcont || 'N/A';
        });
        row[`pais_${nivelEst}`] = respuesta;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      generacionUnico.forEach((nivelEst) => {
        let respuesta = {}; 
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        pregAbUnico.forEach((pregunta) => {
          respuesta = pregAbMap[pregunta][i]?.bdinfgenracion || 'N/A';
        });
        row[`generacion_${nivelEst}`] = respuesta;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      educacionUnico.forEach((nivelEst) => {
        let respuesta = {}; 
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        pregAbUnico.forEach((pregunta) => {
          respuesta = pregAbMap[pregunta][i]?.bdinfgradac || 'N/A';
        });
        row[`educacion_${nivelEst}`] = respuesta;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      generosUnicos.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = generoMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bid.bdinfid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`genero_${nivelEst}`] = filtered[0]?.bdinfindxvc;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      medioTransporteUnico.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = medioTransporteMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bid.bdinfid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`mediotransporte_${nivelEst}`] = filtered[0]?.bdinfindxvc;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      tiempoLlegadaUnico.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = tiempoLlegadaMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bid.bdinfid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`tiempollegada_${nivelEst}`] = filtered[0]?.bdinfindxvc;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      cantidadReunionesUnico.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = cantidadReunionesMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bid.bdinfid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`reunionesjefe_${nivelEst}`] = filtered[0]?.bdinfindxvc;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      oportunidadesMejoraUnico.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = oportunidadesMejoraMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bid.bdinfid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`oportunidadesmejora_${nivelEst}`] = filtered[0]?.bdinfindxvc;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      seguirDesarrollandomeUnico.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = seguirDesarrollandomeMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bid.bdinfid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`seguirdesarrollandome_${nivelEst}`] = filtered[0]?.bdinfindxvc;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      oportunidadesEmpleoUnico.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = oportunidadesEmpleoMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bid.bdinfid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`oportunidadesempleo_${nivelEst}`] = filtered[0]?.bdinfindxvc;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      cantidadEmpleosUnico.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = cantidadEmpleosMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bid.bdinfid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`cantidadempleos_${nivelEst}`] = filtered[0]?.bdinfindxvc;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      padecimientoSaludUnico.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = padecimientoSaludMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bid.bdinfid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`padecimientosalud_${nivelEst}`] = filtered[0]?.bdinfindxvc;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      dependientesEconomicosUnico.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = dependientesEconomicosMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bid.bdinfid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`dependienteseconomicos_${nivelEst}`] = filtered[0]?.bdinfindxvc;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      tiempoGenteACargoUnico.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = tiempoGenteACargoMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bid.bdinfid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`tiempogente_${nivelEst}`] = filtered[0]?.bdinfindxvc;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      modalidadTrabajoUnico.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = modalidadTrabajoMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bid.bdinfid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`modalidatrabajo_${nivelEst}`] = filtered[0]?.bdinfindxvc;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      describirOrganizacionUnico.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = describirOrganizacionMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bid.bdinfid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`describirorganizacion_${nivelEst}`] = filtered[0]?.bdinfindxvc;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      areaUnico.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = areaMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bid.bdinfid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`areaT_${nivelEst}`] = filtered[0]?.bdinfarea;
      });
      cargoUnico.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = cargoMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bdbdo10id.bdid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`cargoT_${nivelEst}`] = filtered[0]?.bdcargo;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      cargoMologadoUnico.forEach((nivelEst) => {
        // Recorremos las preguntas abiertas para agregar las respuestas en las columnas respectivas
        const medioData = cargoMologadoMap[nivelEst] || [];
        const filtered = medioData.filter(item => item.bdbdo10id.bdid === pregAbMap[pregAbUnico[0]][i].bid.bdinfid);
        row[`cargomologado_${nivelEst}`] = filtered[0]?.bdcargoho;  // Aquí es donde asignas el valor de cada nivel estructural
      });
      formatted.push(row);  // Agregamos la fila con las respuestas a los datos formateados
    }
    return formatted;
  };
  
  const calculateYears = (date:Date) => {
    // First Date
    const firstDate: Date = new Date(date);
   
    // Current Date
    const secondDate: Date = new Date();
  
    const years:number = secondDate.getFullYear() - firstDate.getFullYear();
    return years;
  }
  
  // Función para actualizar los datos formateados para la tabla
  const updateFormattedData = () => {
    formattedData.value = [...tableData.value];
  };
  
  // Función para verificar si una fila está expandida
  const isExpanded = (id: number | string): boolean => {
    return expandedRows.value.has(id);
  };
  
  // Función para alternar la expansión de una fila
  const toggleRow = (id: number | string) => {
    if (expandedRows.value.has(id)) {
      // Si se colapsa una fila, también colapsa todos los hijos relacionados
      const childIds = formattedData.value
        .filter(item => item.parent === id)
        .map(item => item.id);
      childIds.forEach(childId => {
        expandedRows.value.delete(childId);
      });
  
      expandedRows.value.delete(id);
    } else {
      expandedRows.value.add(id);
    }
    updateFormattedData();
  };
  
  // Función para obtener el espaciado según el nivel
  const getPadding = (level: string): number => {
    switch (level) {
      case 'dimension':
        return 0;
      case 'subdimension':
        return 20;
      case 'competencia':
        return 40;
      case 'afirmacion':
        return 60;
      default:
        return 0;
    }
  };
  
  // Función para exportar datos a Excel
  const exportToExcel = () => {
    // Verificar si hay datos formateados
    if (!formattedData.value || formattedData.value.length === 0) {
      console.error('No hay datos disponibles para exportar');
      return;
    }
  
    // Formatea los datos para exportarlos
    const dataToExport = formattedData.value.map(item => {
      // Crea un objeto para cada fila de la tabla
      const row = {};
  
      // Verificar si "Género" está en los headers de la tabla
      if (props.filterData.columns.map(nc => nc.name).includes('Genero')) {
        generosUnicos.forEach(genero => {
          row[genero] = item[`genero_${genero}`] || '';
        });
      }
  
      // Verificar si "Medio de transporte" está en los headers de la tabla
      if (props.filterData.columns.map(nc => nc.name).includes('Medio de transporte')) {
        medioTransporteUnico.forEach(mt => {
          row[mt] = item[`mediotransporte_${mt}`] || '';
        });
      }
  
      // Verificar si "Tiempo de llegada" está en los headers de la tabla
      if (props.filterData.columns.map(nc => nc.name).includes('Tiempo de llegada')) {
        tiempoLlegadaUnico.forEach(mt => {
          row[mt] = item[`tiempollegada_${mt}`] || '';
        });
      }
      // Verificar si "Tiempo de llegada" está en los headers de la tabla
      if (props.filterData.columns.map(nc => nc.name).includes('Reuniones con tu jefe')) {
        cantidadReunionesUnico.forEach(mt => {
          row[mt] = item[`reunionesjefe_${mt}`] || '';
        });
      }
  
      if (props.filterData.columns.map(nc => nc.name).includes('Oportunidades')) {
        oportunidadesMejoraUnico.forEach(mt => {
          row[mt] = item[`oportunidadesmejora_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Seguir desarrollandome')) {
        seguirDesarrollandomeUnico.forEach(mt => {
          row[mt] = item[`seguirdesarrollandome_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Buscar oportunidades de empleo')) {
        oportunidadesEmpleoUnico.forEach(mt => {
          row[mt] = item[`oportunidadesempleo_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Cantidad de empleos')) {
        cantidadEmpleosUnico.forEach(mt => {
          row[mt] = item[`cantidadempleos_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Padecimiento de salud crónico')) {
        padecimientoSaludUnico.forEach(mt => {
          row[mt] = item[`padecimientosalud_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Dependientes económicos')) {
        dependientesEconomicosUnico.forEach(mt => {
          row[mt] = item[`dependienteseconomicos_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Tiempo de gente a cargo')) {
        tiempoGenteACargoUnico.forEach(mt => {
          row[mt] = item[`tiempogente_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Modalidad de trabajo')) {
        modalidadTrabajoUnico.forEach(mt => {
          row[mt] = item[`modalidatrabajo_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Area')) {
        areaUnico.forEach(mt => {
          row[mt] = item[`areaT_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Cargo')) {
        cargoUnico.forEach(mt => {
          row[mt] = item[`cargoT_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Cargo mologado')) {
        cargoMologadoUnico.forEach(mt => {
          row[mt] = item[`cargomologado_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Educación')) {
        educacionUnico.forEach(mt => {
          row[mt] = item[`educacion_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Generación')) {
        generacionUnico.forEach(mt => {
          row[mt] = item[`generacion_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Nivel estructural 1')) {
        nivelE1Unico.forEach(mt => {
          row[mt] = item[`nivele1_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Nivel estructural 2')) {
        nivelE2Unico.forEach(mt => {
          row[mt] = item[`nivele2_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Nivel estructural 3')) {
        nivelE3Unico.forEach(mt => {
          row[mt] = item[`nivele3_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Nivel estructural 4')) {
        nivelE4Unico.forEach(mt => {
          row[mt] = item[`nivele4_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Nivel estructural 5')) {
        nivelE5Unico.forEach(mt => {
          row[mt] = item[`nivele5_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Nivel estructural 6')) {
        nivelE6Unico.forEach(mt => {
          row[mt] = item[`nivele6_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Nivel estructural 7')) {
        nivelE7Unico.forEach(mt => {
          row[mt] = item[`nivele7_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Nivel estructural 8')) {
        nivelE8Unico.forEach(mt => {
          row[mt] = item[`nivele8_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Nivel estructural 9')) {
        nivelE9Unico.forEach(mt => {
          row[mt] = item[`nivele9_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Nivel estructural 10')) {
        nivelE10Unico.forEach(mt => {
          row[mt] = item[`nivele10_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Pais')) {
        paisUnico.forEach(mt => {
          row[mt] = item[`pais_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Localidad 1')) {
        localidad1Unico.forEach(mt => {
          row[mt] = item[`local1_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Localidad 2')) {
        localidad2Unico.forEach(mt => {
          row[mt] = item[`local2_${mt}`] || '';
        });
      }
      if (props.filterData.columns.map(nc => nc.name).includes('¿Qué es lo más WOW de trabajar en tu organización?')) {
        row['Qué es lo más WOW de trabajar en tu organización?'] = item[`preguntasab_Qué es lo más WOW de trabajar en tu organización?`] || '';
      }
      if (props.filterData.columns.map(nc => nc.name).includes('¿Qué es lo menos WOW de trabajar en tu organización?')) {
        row['Qué es lo menos WOW de trabajar en tu organización?'] = item[`preguntasab_Qué es lo menos WOW de trabajar en tu organización?`] || '';
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Si tu empresa fuera un vehiculo ¿Qué vehiculo seria?')) {
        row['¿Si tu empresa fuera un vehículo que vehículo sería?'] = item[`preguntasab_¿Si tu empresa fuera un vehículo que vehículo sería?`] || '';
      }
      if (props.filterData.columns.map(nc => nc.name).includes('Menciona 3 caracteristicas que explican porque tu organización sería ese vehiculo.')) {
        row['Menciona 3 características que explican porque tu organización sería ese vehículo.'] = item[`preguntasab_Menciona 3 características que explican porque tu organización sería ese vehículo.`] || '';
      }
      if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
        props.filterData.valores.map((val, index) => {
          row[index] = item[`val${index + 1}`] || '';
        });
      }
  
      return row;
    });
    // Crear la hoja de trabajo (worksheet)
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
    // Crear el libro de trabajo (workbook)
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
  
    // Generar el archivo Excel
    XLSX.writeFile(workbook, 'tablapivote.xlsx');
  };
  
  
  defineExpose({ exportToExcel });
  
  
  // Lifecycle hook para cargar datos al montar el componente
  onMounted(async () => {
    const route = useRoute();

  // Decodificar el token en Base64
  const token = route.query.token as string;
  if (token) {
    try {
      // Verificar si el token necesita padding
      const decodedToken = decodeBase64UrlSafe(token);

      // Tratar de decodificar como UTF-16 y luego convertir a JSON
      tokenPayload.value = parseTokenAsUtf16(decodedToken);

      empresa.value = tokenPayload.value.empresa ? Number(tokenPayload.value.empresa) : null;
      mod.value = tokenPayload.value.modid ? Number(tokenPayload.value.modid) : null;
      sub.value = tokenPayload.value.subid ? Number(tokenPayload.value.subid) : null;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  }
    await empresafounded(empresa.value);
    await answersFounded(empresa.value);

    props.filterData.columns = [
      { id: 42, name: '¿Qué es lo más WOW de trabajar en tu organización?', category: 'preguntas' },
      { id: 43, name: '¿Qué es lo menos WOW de trabajar en tu organización?', category: 'preguntas' },
      { id: 44, name: 'Si tu empresa fuera un vehiculo ¿Qué vehiculo seria?', category: 'preguntas' },
      { id: 45, name: 'Menciona 3 caracteristicas que explican porque tu organización sería ese vehiculo.', category: 'preguntas' },
    ];
  });
  
  // Función para decodificar Base64 URL-Safe
function decodeBase64UrlSafe(base64String: string) {
  // Reemplaza los caracteres que cambian en las URLs
  const base64 = base64String.replace(/-/g, '+').replace(/_/g, '/');
  return atob(base64);
}

// Función para convertir UTF-16 a cadena legible
function parseTokenAsUtf16(decodedString: string) {
  let result = '';
  for (let i = 0; i < decodedString.length; i += 2) {
    // Obtiene dos bytes a la vez (UTF-16 usa 2 bytes por carácter)
    const code = decodedString.charCodeAt(i) + (decodedString.charCodeAt(i + 1) << 8);
    result += String.fromCharCode(code);
  }
  return JSON.parse(result); // Intenta convertir la cadena a un objeto JSON
}
  </script>
  
  <style scoped>
  .tabla_container {
    padding: 0 30px
  }
  </style>
  