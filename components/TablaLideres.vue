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
          <td :style="{ paddingLeft: `${getPadding(item.level)}px` }">
            <v-btn
              v-if="item.level !== 'afirmacion' && item.expandable"
              :icon="isExpanded(item.id) ? '$expand' : '$next'"
              size="small"
              variant="text"
              @click="toggleRow(item.id)"
            ></v-btn>
            <span>{{ item.name }}</span>
          </td>
        
          <td v-for="(header, index) in headers.slice(1)" :key="index">
            <span v-if="item.level === 'afirmacion'">
              {{ getItemValue(item, header.key) }}
            </span>
            <span v-if="item.level === 'competencia'">
              {{ getItemValue(item, header.key) }}
            </span>
            <span v-if="item.level === 'subdimension'">
              {{ getItemValue(item, header.key) }}
            </span>
            <span v-if="item.level === 'dimension'">
              {{ getItemValue(item, header.key) }}
            </span>
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
const overallGeneroResult = ref<{ [key: string]: number }>({});
const overallMedioTResult = ref<{ [key: string]: number }>({});
const overallTiempoLResult = ref<{ [key: string]: number }>({});
const overallCantiReuResult = ref<{ [key: string]: number }>({});
const overallOportMejResult = ref<{ [key: string]: number }>({});
const overallSeguDesResult = ref<{ [key: string]: number }>({});
const overallOportEmpResult = ref<{ [key: string]: number }>({});
const overallCantiEmpResult = ref<{ [key: string]: number }>({});
const overallPadeSaludResult = ref<{ [key: string]: number }>({});
const overallDependEconResult = ref<{ [key: string]: number }>({});
const overallTiempoGenteResult = ref<{ [key: string]: number }>({});
const overallModalidadResult = ref<{ [key: string]: number }>({});
const overallDescOrgResult = ref<{ [key: string]: number }>({});
const overallAñosTrabResult = ref<{ [key: string]: number }>({});
const overallAreaResult = ref<{ [key: string]: number }>({});
const overallCargoResult = ref<{ [key: string]: number }>({});
const overallCargoMolResult = ref<{ [key: string]: number }>({});
const overallEducacionResult = ref<{ [key: string]: number }>({});
const overallGenerResult = ref<{ [key: string]: number }>({});
const overallLocal1Result = ref<{ [key: string]: number }>({});
const overallLocal2Result = ref<{ [key: string]: number }>({});
const overallNivel1Result = ref<{ [key: string]: number }>({});
const overallNivel2Result = ref<{ [key: string]: number }>({});
const overallNivel3Result = ref<{ [key: string]: number }>({});
const overallNivel4Result = ref<{ [key: string]: number }>({});
const overallNivel5Result = ref<{ [key: string]: number }>({});
const overallNivel6Result = ref<{ [key: string]: number }>({});
const overallNivel7Result = ref<{ [key: string]: number }>({});
const overallNivel8Result = ref<{ [key: string]: number }>({});
const overallNivel9Result = ref<{ [key: string]: number }>({});
const overallNivel10Result = ref<{ [key: string]: number }>({});
const overallPaisResult = ref<{ [key: string]: number }>({});
const overallLideresResult = ref<{ [key: string]: number }>({});
let overallLideres = ref<{ [key: string]: number }>({});

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
let lideresUnico: string[] = [];
let lideresNombre: string[] = [];

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
let lideresMap: { [key: string]: any[] } = {};

const filtroPais:any = ref();
const filtroLocalidad1:any = ref();
const filtroLocalidad2:any = ref();
const originalRespuestasData: any = ref([]);
const originalBdbd010Data: any = ref([]);

// Función para obtener los datos de la empresa por ID
const empresafounded = async (id: number) => {
  if (id) {
    const data = await empresasService.getEmpresaId(id);
    empresaData.value = data;
  }
};

const applyFilters = (pais?: string, localidad1?: string, localidad2?: string) => {
  // Aplicamos los filtros sobre la data original
  let filteredBdbd010Data = [...bdbd010Data.value];  // copia de la data original
  let filteredRespuestasData = [...respuestasData.value];  // copia de la data original

  if (pais) {
    filteredBdbd010Data = filteredBdbd010Data.filter((bd: any) => bd.bdcont === pais);
    filteredRespuestasData = filteredRespuestasData.filter((bd: any) => bd.bdinfcont === pais);
  }
  if (localidad1) {
    filteredBdbd010Data = filteredBdbd010Data.filter((bd: any) => bd.bdlocal === localidad1);
    filteredRespuestasData = filteredRespuestasData.filter((bd: any) => bd.bdinflocal === localidad1);
  }
  if (localidad2) {
    filteredBdbd010Data = filteredBdbd010Data.filter((bd: any) => bd.bdlocalb === localidad2);
    filteredRespuestasData = filteredRespuestasData.filter((bd: any) => bd.bdinflocalb === localidad2);
  }

  // Actualizamos las variables filtradas
  bdbd010Data.value = filteredBdbd010Data;
  respuestasData.value = filteredRespuestasData;
};

watch(() => props.filterData, (newFilterData) => {
  filtroPais.value = newFilterData?.pais
  filtroLocalidad1.value = newFilterData?.localidad1
  filtroLocalidad2.value = newFilterData?.localidad2
  
  applyFilters(filtroPais.value, filtroLocalidad1.value, filtroLocalidad2.value);
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
    
    applyFilters(filtroPais.value, filtroLocalidad1.value, filtroLocalidad2.value);
    /* DIMENSIONES */
    const contentTable = respuestasData.value.filter((rd:any) => rd.bid.bdinfdimid >= 2 && rd.bid.bdinfdimid <= 4);
    
    /* LIDERES */
    /* lideres.value = bdbd010Data.value.filter((bd:any) => bd.bdcargoho === 'Jefe de Área o Supervisores' || 
      bd.bdcargoho === 'C Level' || bd.bdcargoho === 'Gerente o SubGerente'); */

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

    lideresUnico = [...new Set(bdbd010Data.value.filter((mt: any) => mt.bdnamejd !== 'VACANTE' && mt.bdavan === 100).map((mt:any) => mt.bdnamejd))]
    lideresUnico.forEach(psu => {
      lideresMap[psu] = bdbd010Data.value.filter((ps: any) => ps.bdnamejd === psu && ps.bdavan === 100);
    });

    tableData.value = transformData(
      (dataDimensions.filter((d: any) => d.dimid >= 2 && d.dimid <= 4)), 
      contentTable, 
      cantidadRespuestas,
      generoMap, generosUnicos, generosCount,
      medioTransporteMap, medioTransporteUnico, medioTransporteCount,
      tiempoLlegadaMap, tiempoLlegadaUnico, tiempoLlegadaCount,
      cantidadReunionesMap, cantidadReunionesUnico, cantidadReunionesCount,
      oportunidadesMejoraMap, oportunidadesMejoraUnico, oportunidadesMejoraCount,
      seguirDesarrollandomeMap, seguirDesarrollandomeUnico, seguirDesarrollandomeCount,
      oportunidadesEmpleoMap, oportunidadesEmpleoUnico, oportunidadesEmpleoCount,
      cantidadEmpleosMap, cantidadEmpleosUnico, cantidadEmpleosCount,
      padecimientoSaludMap, padecimientoSaludUnico, padecimientoSaludCount,
      dependientesEconomicosMap, dependientesEconomicosUnico, dependientesEconomicosCount,
      tiempoGenteACargoMap, tiempoGenteACargoUnico, tiempoGenteACargoCount,
      modalidadTrabajoMap, modalidadTrabajoUnico, modalidadTrabajoCount,
      describirOrganizacionMap, describirOrganizacionUnico, describirOrganizacionCount,
      areaMap, areaUnico,
      cargoMap, cargoUnico,
      cargoMologadoMap, cargoMologadoUnico,
      educacionMap, educacionUnico,
      generacionMap, generacionUnico,
      nivelE1Map, nivelE1Unico,
      nivelE2Map, nivelE2Unico,
      nivelE3Map, nivelE3Unico,
      nivelE4Map, nivelE4Unico,
      nivelE5Map, nivelE5Unico,
      nivelE6Map, nivelE6Unico,
      nivelE7Map, nivelE7Unico,
      nivelE8Map, nivelE8Unico,
      nivelE9Map, nivelE9Unico,
      nivelE10Map, nivelE10Unico,
      paisMap, paisUnico,
      localidad1Map, localidad1Unico,
      localidad2Map, localidad2Unico,
      lideresMap, lideresUnico,
    );
    updateFormattedData();
  }
};

const headers = ref([
  { title: 'Modelo', sortable: false, key: 'dimension' },
  { title: `Overall ${overallResult.value}`, sortable: false, key: 'overall' },
  { title: 'Resultado', sortable: false, key: 'resultado' },
]);

watch(() => props.filterData.columns, (newColumns) => {
  if (newColumns) {
    let dynamicHeaders = [];
    // Verifica si 'generos' está en los nuevos columns
    if (newColumns.map(nc => nc.name).includes('Genero')) {
      dynamicHeaders.push({
          title: 'Género',
          align: 'center',
          key: 'generos-header',
          colspan: generosUnicos.length,
      });

      generosUnicos.forEach((genero, index) => {
        const generoOverall = overallGeneroResult.value[genero]
          ? `${(overallGeneroResult.value[genero]/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados

        dynamicHeaders.push({
            title: `${genero} Overall ${generoOverall}`,
            sortable: false,
            key: `genero_${genero}`,
        });
        // valores por demográfico
        if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
          props.filterData.valores.forEach((val, valIndex) => {
            dynamicHeaders.push({
              title: `Valor ${valIndex + 1} (${genero})`,
              sortable: false,
              key: `genero_${genero}_val${valIndex + 1}`,
            });
          });
        }
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
        const dataOverall = overallMedioTResult.value[mt]
          ? `${((overallMedioTResult.value[mt])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados

          dynamicHeaders.push({
              title: `${mt} Overall ${dataOverall}`,
              sortable: false,
              key: `mediotransporte_${mt}`,
          });

          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${mt})`,
                sortable: false,
                key: `mediotransporte_${mt}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallTiempoLResult.value[tll]
          ? `${((overallTiempoLResult.value[tll])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados

          dynamicHeaders.push({
              title: `${tll} Overall ${dataOverall}`,
              sortable: false,
              key: `tiempollegada_${tll}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${tll})`,
                sortable: false,
                key: `tiempollegada_${tll}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallCantiReuResult.value[cru]
          ? `${((overallCantiReuResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados

        dynamicHeaders.push({
            title: `${cru} Overall ${dataOverall}`,
            sortable: false,
            key: `reunionesjefe_${cru}`,
        });
        if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
          props.filterData.valores.forEach((val, valIndex) => {
            dynamicHeaders.push({
              title: `Valor ${valIndex + 1} (${cru})`,
              sortable: false,
              key: `reunionesjefe_${cru}_val${valIndex + 1}`,
            });
          });
        }
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
        const dataOverall = overallOportMejResult.value[cru]
          ? `${((overallOportMejResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `oportunidadesmejora_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `oportunidadesmejora_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallSeguDesResult.value[cru]
          ? `${((overallSeguDesResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `seguirdesarrollandome_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `seguirdesarrollandome_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallOportEmpResult.value[cru]
          ? `${((overallOportEmpResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `oportunidadesempleo_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `oportunidadesempleo_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallCantiEmpResult.value[cru]
          ? `${((overallCantiEmpResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `cantidadempleos_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `cantidadempleos_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallPadeSaludResult.value[cru]
          ? `${((overallPadeSaludResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `padecimientosalud_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `padecimientosalud_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallDependEconResult.value[cru]
          ? `${((overallDependEconResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `dependienteseconomicos_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `dependienteseconomicos_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallTiempoGenteResult.value[cru]
          ? `${((overallTiempoGenteResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `tiempogente_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `tiempogente_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallModalidadResult.value[cru]
          ? `${((overallModalidadResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `modalidatrabajo_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `modalidatrabajo_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallDescOrgResult.value[cru]
          ? `${((overallDescOrgResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `describirorganizacion_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `describirorganizacion_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallAreaResult.value[cru]
          ? `${((overallAreaResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `areaT_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `areaT_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallCargoResult.value[cru]
          ? `${((overallCargoResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `cargoT_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `cargoT_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallCargoMolResult.value[cru]
          ? `${((overallCargoMolResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `cargomologado_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `cargomologado_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallEducacionResult.value[cru]
          ? `${((overallEducacionResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `educacion_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `educacion_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallGenerResult.value[cru]
          ? `${((overallGenerResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `generacion_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `generacion_${cru}_val${valIndex + 1}`,
              });
            });
          }
      });
    }
    // Verifica si 'Dependientes económicos' está en los nuevos columns
    if (newColumns.map(nc => nc.name).includes('Nivel estructural 1')) {
      dynamicHeaders.push({
          title: 'Nivel estructural 1',
          align: 'center',
          key: 'nivele1-header',
          colspan: nivelE1Unico.length,
      });
      
      nivelE1Unico.forEach((cru, index) => {
        const dataOverall = overallNivel1Result.value[cru]
          ? `${((overallNivel1Result.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `nivele1_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `nivele1_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallNivel2Result.value[cru]
          ? `${((overallNivel2Result.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `nivele2_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `nivele2_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallNivel3Result.value[cru]
          ? `${((overallNivel3Result.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `nivele3_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `nivele3_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallNivel4Result.value[cru]
          ? `${((overallNivel4Result.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `nivele4_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `nivele4_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallNivel5Result.value[cru]
          ? `${((overallNivel5Result.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `nivele5_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `nivele5_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallNivel6Result.value[cru]
          ? `${((overallNivel6Result.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `nivele6_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `nivele6_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallNivel7Result.value[cru]
          ? `${((overallNivel7Result.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `nivele7_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `nivele7_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallNivel8Result.value[cru]
          ? `${((overallNivel8Result.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `nivele8_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `nivele8_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallNivel9Result.value[cru]
          ? `${((overallNivel9Result.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `nivele9_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `nivele9_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallNivel10Result.value[cru]
          ? `${((overallNivel10Result.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `nivele10_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `nivele10_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallPaisResult.value[cru]
          ? `${((overallPaisResult.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `pais_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `pais_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallLocal1Result.value[cru]
          ? `${((overallLocal1Result.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `local1_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `local1_${cru}_val${valIndex + 1}`,
              });
            });
          }
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
        const dataOverall = overallLocal2Result.value[cru]
          ? `${((overallLocal2Result.value[cru])/3).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados
          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `local2_${cru}`,
          });
          if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
            props.filterData.valores.forEach((val, valIndex) => {
              dynamicHeaders.push({
                title: `Valor ${valIndex + 1} (${cru})`,
                sortable: false,
                key: `local2_${cru}_val${valIndex + 1}`,
              });
            });
          }
      });
    }
    // columns
    if (newColumns.map(nc => nc.name).includes('Lideres')) {
      dynamicHeaders.push({
          title: 'Lideres',
          align: 'center',
          key: 'lideres-header',
          colspan: lideresUnico.length,
      });
      
      lideresUnico.forEach((cru, index) => {
        const dataOverall = overallLideresResult.value[cru]
          ? `${(overallLideres.value[cru]).toFixed(0)}%`  // Calcula el promedio del overall
          : '0%';  // Valor por defecto si no hay resultados

          dynamicHeaders.push({
              title: `${cru} Overall ${dataOverall}`,
              sortable: false,
              key: `lideres_${cru}`,
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
      { title: 'Modelo', sortable: false, key: 'dimension' },
      { title: `Overall ${(overallResult.value/3).toFixed(0)}%`, sortable: false, key: 'overall' },
      { title: 'Resultado', sortable: false, key: 'resultado' },
      ...valoresHeaders,
      ...dynamicHeaders,
    ];
  }
}, { immediate: true });


// Filtrar los datos según la selección
const applyFilter = () => {
  formattedData.value = [];
  selectedLevels.value = [];
  
  if (props.filterData && Array.isArray(props.filterData.rows)) {
    if (props.filterData.rows.map(nc => nc.name).includes('Dimensiones')) {
      formattedData.value = tableData.value
        .filter(item => item.level === 'dimension')
        .map(item => ({ ...item, expandable: false }));
      selectedLevels.value.push('dimension');
    }

    if (props.filterData.rows.map(nc => nc.name).includes('Subdimensiones')) {
      formattedData.value = tableData.value
        .filter(item => item.level === 'dimension' || item.level === 'subdimension')
        .map(item => ({ 
          ...item, 
          expandable: item.level === 'dimension' 
        }));
      selectedLevels.value.push('subdimension');
    }

    if (props.filterData.rows.map(nc => nc.name).includes('Competencias')) {
      formattedData.value = tableData.value
        .filter(item => item.level === 'dimension' || item.level === 'subdimension' || item.level === 'competencia')
        .map(item => ({ 
          ...item, 
          expandable: item.level === 'dimension' || item.level === 'subdimension' 
        }));
      selectedLevels.value.push('competencia');
    }

    if (props.filterData.rows.map(nc => nc.name).includes('Afirmaciones')) {
      formattedData.value = tableData.value
        .filter(item => item.level === 'dimension' || item.level === 'subdimension' || item.level === 'competencia' || item.level === 'afirmacion')
        .map(item => ({ 
          ...item, 
          expandable: item.level === 'dimension' || item.level === 'subdimension' || item.level === 'competencia' 
        }));
      selectedLevels.value.push('afirmacion');
    }
  } else {
    console.error("filterData o filterData.rows no está definido o no es un array.");
  }
};


// Observa los cambios en filterData para aplicar el filtro automáticamente
watch(() => props.filterData, applyFilter, { deep: true });

// Función para transformar datos planos a la estructura jerárquica
const transformData = (dataDimensions: any[], contentTable: any[], cantidadRespuestas:number, 
      generoMap: { [key: string]: any[] }, generosUnicos: string[], generosCount: any[], 
      medioTransporteMap: { [key: string]: any[] }, medioTransporteUnico: string[], medioTransporteCount: any[],
      tiempoLlegadaMap: { [key: string]: any[] }, tiempoLlegadaUnico: string[], tiempoLlegadaCount: any[],
      cantidadReunionesMap: { [key: string]: any[] }, cantidadReunionesUnico: string[], cantidadReunionesCount: any[], 
      oportunidadesMejoraMap: { [key: string]: any[] }, oportunidadesMejoraUnico: string[], oportunidadesMejoraCount: any[],
      seguirDesarrollandomeMap: { [key: string]: any[] }, seguirDesarrollandomeUnico: string[], seguirDesarrollandomeCount: any[],
      oportunidadesEmpleoMap: { [key: string]: any[] }, oportunidadesEmpleoUnico: string[], oportunidadesEmpleoCount: any[],
      cantidadEmpleosMap: { [key: string]: any[] }, cantidadEmpleosUnico: string[], cantidadEmpleosCount: any[],
      padecimientoSaludMap: { [key: string]: any[] }, padecimientoSaludUnico: string[], padecimientoSaludCount: any[],
      dependientesEconomicosMap: { [key: string]: any[] }, dependientesEconomicosUnico: string[], dependientesEconomicosCount: any[],
      tiempoGenteACargoMap: { [key: string]: any[] }, tiempoGenteACargoUnico: string[], tiempoGenteACargoCount: any[],
      modalidadTrabajoMap: { [key: string]: any[] }, modalidadTrabajoUnico: string[], modalidadTrabajoCount: any[],
      describirOrganizacionMap: { [key: string]: any[] }, describirOrganizacionUnico: string[], describirOrganizacionCount: any[],
      areaMap: { [key: string]: any[] }, areaUnico: string[],
      cargoMap: { [key: string]: any[] }, cargoUnico: string[],
      cargoMologadoMap: { [key: string]: any[] }, cargoMologadoUnico: string[],
      educacionMap: { [key: string]: any[] }, educacionUnico: string[],
      generacionMap: { [key: string]: any[] }, generacionUnico: string[],
      nivelE1Map: { [key: string]: any[] }, nivelE1Unico: string[],
      nivelE2Map: { [key: string]: any[] }, nivelE2Unico: string[],
      nivelE3Map: { [key: string]: any[] }, nivelE3Unico: string[],
      nivelE4Map: { [key: string]: any[] }, nivelE4Unico: string[],
      nivelE5Map: { [key: string]: any[] }, nivelE5Unico: string[],
      nivelE6Map: { [key: string]: any[] }, nivelE6Unico: string[],
      nivelE7Map: { [key: string]: any[] }, nivelE7Unico: string[],
      nivelE8Map: { [key: string]: any[] }, nivelE8Unico: string[],
      nivelE9Map: { [key: string]: any[] }, nivelE9Unico: string[],
      nivelE10Map: { [key: string]: any[] }, nivelE10Unico: string[],
      paisMap: { [key: string]: any[] }, paisUnico: string[],
      localidad1Map: { [key: string]: any[] }, localidad1Unico: string[],
      localidad2Map: { [key: string]: any[] }, localidad2Unico: string[],
      lideresMap: { [key: string]: any[] }, lideresUnico: string[],
  ): any[] => {
  const formatted: any[] = [];
  const addedItems = new Set();

  const dimensionMap = new Map();
  const subDimensionMap = new Map();
  const competenciaMap = new Map();

  // Crear acumuladores para cada demografico
  const dimensionGeneroMap = new Map();
  const subDimensionGeneroMap = new Map();
  const competenciaGeneroMap = new Map();
  // 
  const dimensionmedioTransporteMap = new Map();
  const subDimensionmedioTransporteMap = new Map();
  const competenciamedioTransporteMap = new Map();
  // 
  const dimensiontiempoLlegadaMap = new Map();
  const subDimensiontiempoLlegadaMap = new Map();
  const competenciatiempoLlegadaMap = new Map();
  // 
  const dimensioncantidadReunionesMap = new Map();
  const subDimensioncantidadReunionesMap = new Map();
  const competenciacantidadReunionesMap = new Map();
  // 
  const dimensionoportunidadesMejoraMap = new Map();
  const subDimensionoportunidadesMejoraMap = new Map();
  const competenciaoportunidadesMejoraMap = new Map();
  // 
  const dimensionseguirDesarrollandomeMap = new Map();
  const subDimensionseguirDesarrollandomeMap = new Map();
  const competenciaseguirDesarrollandomeMap = new Map();
  // 
  const dimensionoportunidadesEmpleoMap = new Map();
  const subDimensionoportunidadesEmpleoMap = new Map();
  const competenciaoportunidadesEmpleoMap = new Map();
  // 
  const dimensioncantidadEmpleosMap = new Map();
  const subDimensioncantidadEmpleosMap = new Map();
  const competenciacantidadEmpleosMap = new Map();
  // 
  const dimensionpadecimientoSaludMap = new Map();
  const subDimensionpadecimientoSaludMap = new Map();
  const competenciapadecimientoSaludMap = new Map();
  // 
  const dimensiondependientesEconomicosMap = new Map();
  const subDimensiondependientesEconomicosMap = new Map();
  const competenciadependientesEconomicosMap = new Map();
  // 
  const dimensiontiempoGenteACargoMap = new Map();
  const subDimensiontiempoGenteACargoMap = new Map();
  const competenciatiempoGenteACargoMap = new Map();
  // 
  const dimensionmodalidadTrabajoMap = new Map();
  const subDimensionmodalidadTrabajoMap = new Map();
  const competenciamodalidadTrabajoMap = new Map();
  // 
  const dimensiondescribirOrganizacionMap = new Map();
  const subDimensiondescribirOrganizacionMap = new Map();
  const competenciadescribirOrganizacionMap = new Map();
  // 
  const dimensionareaMap = new Map();
  const subDimensionareaMap = new Map();
  const competenciaareaMap = new Map();
  // 
  const dimensioncargoMap = new Map();
  const subDimensioncargoMap = new Map();
  const competenciacargoMap = new Map();
  // 
  const dimensioncargoMologadoMap = new Map();
  const subDimensioncargoMologadoMap = new Map();
  const competenciacargoMologadoMap = new Map();
  // 
  const dimensioneducacionMap = new Map();
  const subDimensioneducacionMap = new Map();
  const competenciaeducacionMap = new Map();
  // 
  const dimensiongeneracionMap = new Map();
  const subDimensiongeneracionMap = new Map();
  const competenciageneracionMap = new Map();
  // 
  const dimensionnivelE1Map = new Map();
  const subDimensionnivelE1Map = new Map();
  const competencianivelE1Map = new Map();
  // 
  const dimensionnivelE2Map = new Map();
  const subDimensionnivelE2Map = new Map();
  const competencianivelE2Map = new Map();
  // 
  const dimensionnivelE3Map = new Map();
  const subDimensionnivelE3Map = new Map();
  const competencianivelE3Map = new Map();
  // 
  const dimensionnivelE4Map = new Map();
  const subDimensionnivelE4Map = new Map();
  const competencianivelE4Map = new Map();
  // 
  const dimensionnivelE5Map = new Map();
  const subDimensionnivelE5Map = new Map();
  const competencianivelE5Map = new Map();
  // 
  const dimensionnivelE6Map = new Map();
  const subDimensionnivelE6Map = new Map();
  const competencianivelE6Map = new Map();
  // 
  const dimensionnivelE7Map = new Map();
  const subDimensionnivelE7Map = new Map();
  const competencianivelE7Map = new Map();
  // 
  const dimensionnivelE8Map = new Map();
  const subDimensionnivelE8Map = new Map();
  const competencianivelE8Map = new Map();
  // 
  const dimensionnivelE9Map = new Map();
  const subDimensionnivelE9Map = new Map();
  const competencianivelE9Map = new Map();
  // 
  const dimensionnivelE10Map = new Map();
  const subDimensionnivelE10Map = new Map();
  const competencianivelE10Map = new Map();
  // 
  const dimensionpaisMap = new Map();
  const subDimensionpaisMap = new Map();
  const competenciapaisMap = new Map();
  // 
  const dimensionlocalidad1Map = new Map();
  const subDimensionlocalidad1Map = new Map();
  const competencialocalidad1Map = new Map();
  // 
  const dimensionlocalidad2Map = new Map();
  const subDimensionlocalidad2Map = new Map();
  const competencialocalidad2Map = new Map();
  // 
  const dimensionlideresMap = new Map();
  const subDimensionlideresMap = new Map();
  const competencialideresMap = new Map();

  //const tableFilterData = contentTable;
  dataDimensions.forEach(item => {
    const {
      empid, dimid, dimdesc, lindidlin, linddescc, indclasifi, indxlidln, indxldesc
    } = item;

    const afirmaciones = contentTable.filter(ct => 
      ct.bid.bdinfdimid === dimid && 
      ct.bid.bdinfidlinn === lindidlin && 
      ct.bid.bdinfidindn === indxlidln && 
      ct.bdinfindxvcn >= 4
    );
    const afirmVal1 = contentTable.filter(ct => 
      ct.bid.bdinfdimid === dimid && 
      ct.bid.bdinfidlinn === lindidlin && 
      ct.bid.bdinfidindn === indxlidln && 
      ct.bdinfindxvcn === 1
    );
    const afirmVal2 = contentTable.filter(ct => 
      ct.bid.bdinfdimid === dimid && 
      ct.bid.bdinfidlinn === lindidlin && 
      ct.bid.bdinfidindn === indxlidln && 
      ct.bdinfindxvcn === 2
    );
    const afirmVal3 = contentTable.filter(ct => 
      ct.bid.bdinfdimid === dimid && 
      ct.bid.bdinfidlinn === lindidlin && 
      ct.bid.bdinfidindn === indxlidln && 
      ct.bdinfindxvcn === 3
    );
    const afirmVal4 = contentTable.filter(ct => 
      ct.bid.bdinfdimid === dimid && 
      ct.bid.bdinfidlinn === lindidlin && 
      ct.bid.bdinfidindn === indxlidln && 
      ct.bdinfindxvcn === 4
    );
    const afirmVal5 = contentTable.filter(ct => 
      ct.bid.bdinfdimid === dimid && 
      ct.bid.bdinfidlinn === lindidlin && 
      ct.bid.bdinfidindn === indxlidln && 
      ct.bdinfindxvcn === 5
    );

    // Handle Dimensions
    if (!addedItems.has(dimid)) {
      formatted.push({
        name: dimdesc,
        level: 'dimension',
        id: dimid,
        expandable: true,
        resultado: `0%`,
        // Inicializar géneros con '0%'
        ...generosUnicos.reduce((acc, dat) => ({ ...acc, [`genero_${dat}`]: '0%' }), {}),
        ...medioTransporteUnico.reduce((acc, dat) => ({ ...acc, [`mediotransporte_${dat}`]: '0%' }), {}),
        ...tiempoLlegadaUnico.reduce((acc, dat) => ({ ...acc, [`tiempollegada_${dat}`]: '0%' }), {}),
        ...cantidadReunionesUnico.reduce((acc, dat) => ({ ...acc, [`reunionesjefe_${dat}`]: '0%' }), {}),
        ...oportunidadesMejoraUnico.reduce((acc, dat) => ({ ...acc, [`oportunidadesmejora_${dat}`]: '0%' }), {}),
        ...seguirDesarrollandomeUnico.reduce((acc, dat) => ({ ...acc, [`seguirdesarrollandome_${dat}`]: '0%' }), {}),
        ...oportunidadesEmpleoUnico.reduce((acc, dat) => ({ ...acc, [`oportunidadesempleo_${dat}`]: '0%' }), {}),
        ...cantidadEmpleosUnico.reduce((acc, dat) => ({ ...acc, [`cantidadempleos_${dat}`]: '0%' }), {}),
        ...padecimientoSaludUnico.reduce((acc, dat) => ({ ...acc, [`padecimientosalud_${dat}`]: '0%' }), {}),
        ...dependientesEconomicosUnico.reduce((acc, dat) => ({ ...acc, [`dependienteseconomicos_${dat}`]: '0%' }), {}),
        ...tiempoGenteACargoUnico.reduce((acc, dat) => ({ ...acc, [`tiempogente_${dat}`]: '0%' }), {}),
        ...modalidadTrabajoUnico.reduce((acc, dat) => ({ ...acc, [`modalidatrabajo_${dat}`]: '0%' }), {}),
        ...describirOrganizacionUnico.reduce((acc, dat) => ({ ...acc, [`describirorganizacion_${dat}`]: '0%' }), {}),
        ...areaUnico.reduce((acc, dat) => ({ ...acc, [`areaT_${dat}`]: '0%' }), {}),
        ...cargoUnico.reduce((acc, dat) => ({ ...acc, [`cargoT_${dat}`]: '0%' }), {}),
        ...cargoMologadoUnico.reduce((acc, dat) => ({ ...acc, [`cargomologado_${dat}`]: '0%' }), {}),
        ...educacionUnico.reduce((acc, dat) => ({ ...acc, [`educacion_${dat}`]: '0%' }), {}),
        ...generacionUnico.reduce((acc, dat) => ({ ...acc, [`generacion_${dat}`]: '0%' }), {}),
        ...nivelE1Unico.reduce((acc, dat) => ({ ...acc, [`nivele1_${dat}`]: '0%' }), {}),
        ...nivelE2Unico.reduce((acc, dat) => ({ ...acc, [`nivele2_${dat}`]: '0%' }), {}),
        ...nivelE3Unico.reduce((acc, dat) => ({ ...acc, [`nivele3_${dat}`]: '0%' }), {}),
        ...nivelE4Unico.reduce((acc, dat) => ({ ...acc, [`nivele4_${dat}`]: '0%' }), {}),
        ...nivelE5Unico.reduce((acc, dat) => ({ ...acc, [`nivele5_${dat}`]: '0%' }), {}),
        ...nivelE6Unico.reduce((acc, dat) => ({ ...acc, [`nivele6_${dat}`]: '0%' }), {}),
        ...nivelE7Unico.reduce((acc, dat) => ({ ...acc, [`nivele7_${dat}`]: '0%' }), {}),
        ...nivelE8Unico.reduce((acc, dat) => ({ ...acc, [`nivele8_${dat}`]: '0%' }), {}),
        ...nivelE9Unico.reduce((acc, dat) => ({ ...acc, [`nivele9_${dat}`]: '0%' }), {}),
        ...nivelE10Unico.reduce((acc, dat) => ({ ...acc, [`nivele10_${dat}`]: '0%' }), {}),
        ...paisUnico.reduce((acc, dat) => ({ ...acc, [`pais_${dat}`]: '0%' }), {}),
        ...localidad1Unico.reduce((acc, dat) => ({ ...acc, [`local1_${dat}`]: '0%' }), {}),
        ...localidad2Unico.reduce((acc, dat) => ({ ...acc, [`local2_${dat}`]: '0%' }), {}),
        ...lideresUnico.reduce((acc, dat) => ({ ...acc, [`lideres_${dat}`]: '0%' }), {}),
        count: 0,
      });
      addedItems.add(dimid);
      dimensionMap.set(dimid, { totalResult: 0,count: 0 });
      // Inicializar mapa de demograficos en dimensiones
      dimensionGeneroMap.set(dimid, generosUnicos.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionmedioTransporteMap.set(dimid, medioTransporteUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensiontiempoLlegadaMap.set(dimid, tiempoLlegadaUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensioncantidadReunionesMap.set(dimid, cantidadReunionesUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionoportunidadesMejoraMap.set(dimid, oportunidadesMejoraUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionseguirDesarrollandomeMap.set(dimid, seguirDesarrollandomeUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionoportunidadesEmpleoMap.set(dimid, oportunidadesEmpleoUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensioncantidadEmpleosMap.set(dimid, cantidadEmpleosUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionpadecimientoSaludMap.set(dimid, padecimientoSaludUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensiondependientesEconomicosMap.set(dimid, dependientesEconomicosUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensiontiempoGenteACargoMap.set(dimid, tiempoGenteACargoUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionmodalidadTrabajoMap.set(dimid, modalidadTrabajoUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensiondescribirOrganizacionMap.set(dimid, describirOrganizacionUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionareaMap.set(dimid, areaUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensioncargoMap.set(dimid, cargoUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensioncargoMologadoMap.set(dimid, cargoMologadoUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensioneducacionMap.set(dimid, educacionUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensiongeneracionMap.set(dimid, generacionUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionnivelE1Map.set(dimid, nivelE1Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionnivelE2Map.set(dimid, nivelE2Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionnivelE3Map.set(dimid, nivelE3Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionnivelE4Map.set(dimid, nivelE4Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionnivelE5Map.set(dimid, nivelE5Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionnivelE6Map.set(dimid, nivelE6Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionnivelE7Map.set(dimid, nivelE7Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionnivelE8Map.set(dimid, nivelE8Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionnivelE9Map.set(dimid, nivelE9Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionnivelE10Map.set(dimid, nivelE10Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionpaisMap.set(dimid, paisUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionlocalidad1Map.set(dimid, localidad1Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionlocalidad2Map.set(dimid, localidad2Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      dimensionlideresMap.set(dimid, lideresUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
    }

    // Handle Subdimensions
    if (!addedItems.has(`${dimid}-${lindidlin}`)) {
      formatted.push({
        name: linddescc.trim(),
        level: 'subdimension',
        id: `${dimid}-${lindidlin}`,
        parent: dimid,
        expandable: true,
        resultado: `0%`,
        ...generosUnicos.reduce((acc, genero) => ({ ...acc, [`genero_${genero}`]: '0%' }), {}),
        ...medioTransporteUnico.reduce((acc, dat) => ({ ...acc, [`mediotransporte_${dat}`]: '0%' }), {}),
        ...tiempoLlegadaUnico.reduce((acc, dat) => ({ ...acc, [`tiempollegada_${dat}`]: '0%' }), {}),
        ...cantidadReunionesUnico.reduce((acc, dat) => ({ ...acc, [`reunionesjefe_${dat}`]: '0%' }), {}),
        ...oportunidadesMejoraUnico.reduce((acc, dat) => ({ ...acc, [`oportunidadesmejora_${dat}`]: '0%' }), {}),
        ...seguirDesarrollandomeUnico.reduce((acc, dat) => ({ ...acc, [`seguirdesarrollandome_${dat}`]: '0%' }), {}),
        ...oportunidadesEmpleoUnico.reduce((acc, dat) => ({ ...acc, [`oportunidadesempleo_${dat}`]: '0%' }), {}),
        ...cantidadEmpleosUnico.reduce((acc, dat) => ({ ...acc, [`cantidadempleos_${dat}`]: '0%' }), {}),
        ...padecimientoSaludUnico.reduce((acc, dat) => ({ ...acc, [`padecimientosalud_${dat}`]: '0%' }), {}),
        ...dependientesEconomicosUnico.reduce((acc, dat) => ({ ...acc, [`dependienteseconomicos_${dat}`]: '0%' }), {}),
        ...tiempoGenteACargoUnico.reduce((acc, dat) => ({ ...acc, [`tiempogente_${dat}`]: '0%' }), {}),
        ...modalidadTrabajoUnico.reduce((acc, dat) => ({ ...acc, [`modalidatrabajo_${dat}`]: '0%' }), {}),
        ...describirOrganizacionUnico.reduce((acc, dat) => ({ ...acc, [`describirorganizacion_${dat}`]: '0%' }), {}),
        ...areaUnico.reduce((acc, dat) => ({ ...acc, [`areaT_${dat}`]: '0%' }), {}),
        ...cargoUnico.reduce((acc, dat) => ({ ...acc, [`cargoT_${dat}`]: '0%' }), {}),
        ...cargoMologadoUnico.reduce((acc, dat) => ({ ...acc, [`cargomologado_${dat}`]: '0%' }), {}),
        ...educacionUnico.reduce((acc, dat) => ({ ...acc, [`educacion_${dat}`]: '0%' }), {}),
        ...generacionUnico.reduce((acc, dat) => ({ ...acc, [`generacion_${dat}`]: '0%' }), {}),
        ...nivelE1Unico.reduce((acc, dat) => ({ ...acc, [`nivele1_${dat}`]: '0%' }), {}),
        ...nivelE2Unico.reduce((acc, dat) => ({ ...acc, [`nivele2_${dat}`]: '0%' }), {}),
        ...nivelE3Unico.reduce((acc, dat) => ({ ...acc, [`nivele3_${dat}`]: '0%' }), {}),
        ...nivelE4Unico.reduce((acc, dat) => ({ ...acc, [`nivele4_${dat}`]: '0%' }), {}),
        ...nivelE5Unico.reduce((acc, dat) => ({ ...acc, [`nivele5_${dat}`]: '0%' }), {}),
        ...nivelE6Unico.reduce((acc, dat) => ({ ...acc, [`nivele6_${dat}`]: '0%' }), {}),
        ...nivelE7Unico.reduce((acc, dat) => ({ ...acc, [`nivele7_${dat}`]: '0%' }), {}),
        ...nivelE8Unico.reduce((acc, dat) => ({ ...acc, [`nivele8_${dat}`]: '0%' }), {}),
        ...nivelE9Unico.reduce((acc, dat) => ({ ...acc, [`nivele9_${dat}`]: '0%' }), {}),
        ...nivelE10Unico.reduce((acc, dat) => ({ ...acc, [`nivele10_${dat}`]: '0%' }), {}),
        ...paisUnico.reduce((acc, dat) => ({ ...acc, [`pais_${dat}`]: '0%' }), {}),
        ...localidad1Unico.reduce((acc, dat) => ({ ...acc, [`local1_${dat}`]: '0%' }), {}),
        ...localidad2Unico.reduce((acc, dat) => ({ ...acc, [`local2_${dat}`]: '0%' }), {}),
        ...lideresUnico.reduce((acc, dat) => ({ ...acc, [`lideres_${dat}`]: '0%' }), {}),
        count: 0,
      });
      addedItems.add(`${dimid}-${lindidlin}`);
      subDimensionMap.set(`${dimid}-${lindidlin}`, { totalResult: 0, count: 0 });

      // Inicializar mapa de demográficos en subdimensiones
      subDimensionGeneroMap.set(`${dimid}-${lindidlin}`, generosUnicos.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionmedioTransporteMap.set(`${dimid}-${lindidlin}`, medioTransporteUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensiontiempoLlegadaMap.set(`${dimid}-${lindidlin}`, tiempoLlegadaUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensioncantidadReunionesMap.set(`${dimid}-${lindidlin}`, cantidadReunionesUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionoportunidadesMejoraMap.set(`${dimid}-${lindidlin}`, oportunidadesMejoraUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionseguirDesarrollandomeMap.set(`${dimid}-${lindidlin}`, seguirDesarrollandomeUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionoportunidadesEmpleoMap.set(`${dimid}-${lindidlin}`, oportunidadesEmpleoUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensioncantidadEmpleosMap.set(`${dimid}-${lindidlin}`, cantidadEmpleosUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionpadecimientoSaludMap.set(`${dimid}-${lindidlin}`, padecimientoSaludUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensiondependientesEconomicosMap.set(`${dimid}-${lindidlin}`, dependientesEconomicosUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensiontiempoGenteACargoMap.set(`${dimid}-${lindidlin}`, tiempoGenteACargoUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionmodalidadTrabajoMap.set(`${dimid}-${lindidlin}`, modalidadTrabajoUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensiondescribirOrganizacionMap.set(`${dimid}-${lindidlin}`, describirOrganizacionUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionareaMap.set(`${dimid}-${lindidlin}`, areaUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensioncargoMap.set(`${dimid}-${lindidlin}`, cargoUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensioncargoMologadoMap.set(`${dimid}-${lindidlin}`, cargoMologadoUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensioneducacionMap.set(`${dimid}-${lindidlin}`, educacionUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensiongeneracionMap.set(`${dimid}-${lindidlin}`, generacionUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionnivelE1Map.set(`${dimid}-${lindidlin}`, nivelE1Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionnivelE2Map.set(`${dimid}-${lindidlin}`, nivelE2Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionnivelE3Map.set(`${dimid}-${lindidlin}`, nivelE3Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionnivelE4Map.set(`${dimid}-${lindidlin}`, nivelE4Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionnivelE5Map.set(`${dimid}-${lindidlin}`, nivelE5Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionnivelE6Map.set(`${dimid}-${lindidlin}`, nivelE6Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionnivelE7Map.set(`${dimid}-${lindidlin}`, nivelE7Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionnivelE8Map.set(`${dimid}-${lindidlin}`, nivelE8Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionnivelE9Map.set(`${dimid}-${lindidlin}`, nivelE9Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionnivelE10Map.set(`${dimid}-${lindidlin}`, nivelE10Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionpaisMap.set(`${dimid}-${lindidlin}`, paisUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionlocalidad1Map.set(`${dimid}-${lindidlin}`, localidad1Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionlocalidad2Map.set(`${dimid}-${lindidlin}`, localidad2Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      subDimensionlideresMap.set(`${dimid}-${lindidlin}`, lideresUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
    }

    // Handle Competencias
    if (!addedItems.has(`${lindidlin}-${indclasifi}`)) {
      formatted.push({
        name: indclasifi,
        level: 'competencia',
        id: `${lindidlin}-${indclasifi}`,
        parent: `${dimid}-${lindidlin}`,
        expandable: true,
        resultado: `0%`,
        val1: `0`,
        val2: `0`,
        val3: `0`,
        val4: `0`,
        val5: `0`,
        count: 0,
      });
      addedItems.add(`${lindidlin}-${indclasifi}`);
      competenciaMap.set(`${lindidlin}-${indclasifi}`, { totalResult: 0, count: 0 });

      // Inicializar mapa de demograficos en competencias
      competenciaGeneroMap.set(`${lindidlin}-${indclasifi}`, generosUnicos.reduce((acc, genero) => ({ ...acc, [genero]: { total: 0, count: 0 } }), {}));
      competenciamedioTransporteMap.set(`${lindidlin}-${indclasifi}`, medioTransporteUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciatiempoLlegadaMap.set(`${lindidlin}-${indclasifi}`, tiempoLlegadaUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciacantidadReunionesMap.set(`${lindidlin}-${indclasifi}`, cantidadReunionesUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciaoportunidadesMejoraMap.set(`${lindidlin}-${indclasifi}`, oportunidadesMejoraUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciaseguirDesarrollandomeMap.set(`${lindidlin}-${indclasifi}`, seguirDesarrollandomeUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciaoportunidadesEmpleoMap.set(`${lindidlin}-${indclasifi}`, oportunidadesEmpleoUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciacantidadEmpleosMap.set(`${lindidlin}-${indclasifi}`, cantidadEmpleosUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciapadecimientoSaludMap.set(`${lindidlin}-${indclasifi}`, padecimientoSaludUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciadependientesEconomicosMap.set(`${lindidlin}-${indclasifi}`, dependientesEconomicosUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciatiempoGenteACargoMap.set(`${lindidlin}-${indclasifi}`, tiempoGenteACargoUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciamodalidadTrabajoMap.set(`${lindidlin}-${indclasifi}`, modalidadTrabajoUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciadescribirOrganizacionMap.set(`${lindidlin}-${indclasifi}`, describirOrganizacionUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciaareaMap.set(`${lindidlin}-${indclasifi}`, areaUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciacargoMap.set(`${lindidlin}-${indclasifi}`, cargoUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciacargoMologadoMap.set(`${lindidlin}-${indclasifi}`, cargoMologadoUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciaeducacionMap.set(`${lindidlin}-${indclasifi}`, educacionUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciageneracionMap.set(`${lindidlin}-${indclasifi}`, generacionUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competencianivelE1Map.set(`${lindidlin}-${indclasifi}`, nivelE1Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competencianivelE2Map.set(`${lindidlin}-${indclasifi}`, nivelE2Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competencianivelE3Map.set(`${lindidlin}-${indclasifi}`, nivelE3Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competencianivelE4Map.set(`${lindidlin}-${indclasifi}`, nivelE4Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competencianivelE5Map.set(`${lindidlin}-${indclasifi}`, nivelE5Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competencianivelE6Map.set(`${lindidlin}-${indclasifi}`, nivelE6Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competencianivelE7Map.set(`${lindidlin}-${indclasifi}`, nivelE7Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competencianivelE8Map.set(`${lindidlin}-${indclasifi}`, nivelE8Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competencianivelE9Map.set(`${lindidlin}-${indclasifi}`, nivelE9Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competencianivelE10Map.set(`${lindidlin}-${indclasifi}`, nivelE10Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competenciapaisMap.set(`${lindidlin}-${indclasifi}`, paisUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competencialocalidad1Map.set(`${lindidlin}-${indclasifi}`, localidad1Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competencialocalidad2Map.set(`${lindidlin}-${indclasifi}`, localidad2Unico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
      competencialideresMap.set(`${lindidlin}-${indclasifi}`, lideresUnico.reduce((acc, dat) => ({ ...acc, [dat]: { total: 0, count: 0 } }), {}));
    }

    let resultado = '0%';
    if (cantidadRespuestas.value > 3) {
      const porcentaje = ((afirmaciones.length * 100) / cantidadRespuestas.value).toFixed(0);
      resultado = `${porcentaje}%`;
    }
    // Handle Afirmaciones    
    const afirmacion = {
      name: indxldesc.trim(),
      level: 'afirmacion',
      id: `${lindidlin}-${indclasifi}-${indxlidln}`,
      parent: `${lindidlin}-${indclasifi}`,
      resultado,
      val1: `${((afirmVal1.length * 100) / cantidadRespuestas.value).toFixed(0)}%`,
      val2: `${((afirmVal2.length * 100) / cantidadRespuestas.value).toFixed(0)}%`,
      val3: `${((afirmVal3.length * 100) / cantidadRespuestas.value).toFixed(0)}%`,
      val4: `${((afirmVal4.length * 100) / cantidadRespuestas.value).toFixed(0)}%`,
      val5: `${((afirmVal5.length * 100) / cantidadRespuestas.value).toFixed(0)}%`,
      ...generosUnicos.reduce((acc, genero) => ({ ...acc, [`genero_${genero}`]: '0%' }), {}),
      ...medioTransporteUnico.reduce((acc, dat) => ({ ...acc, [`mediotransporte_${dat}`]: '0%' }), {}),
      ...tiempoLlegadaUnico.reduce((acc, dat) => ({ ...acc, [`tiempollegada_${dat}`]: '0%' }), {}),
      ...cantidadReunionesUnico.reduce((acc, dat) => ({ ...acc, [`reunionesjefe_${dat}`]: '0%' }), {}),
      ...oportunidadesMejoraUnico.reduce((acc, dat) => ({ ...acc, [`oportunidadesmejora_${dat}`]: '0%' }), {}),
      ...seguirDesarrollandomeUnico.reduce((acc, dat) => ({ ...acc, [`seguirdesarrollandome_${dat}`]: '0%' }), {}),
      ...oportunidadesEmpleoUnico.reduce((acc, dat) => ({ ...acc, [`oportunidadesempleo_${dat}`]: '0%' }), {}),
      ...cantidadEmpleosUnico.reduce((acc, dat) => ({ ...acc, [`cantidadempleos_${dat}`]: '0%' }), {}),
      ...padecimientoSaludUnico.reduce((acc, dat) => ({ ...acc, [`padecimientosalud_${dat}`]: '0%' }), {}),
      ...dependientesEconomicosUnico.reduce((acc, dat) => ({ ...acc, [`dependienteseconomicos_${dat}`]: '0%' }), {}),
      ...tiempoGenteACargoUnico.reduce((acc, dat) => ({ ...acc, [`tiempogente_${dat}`]: '0%' }), {}),
      ...modalidadTrabajoUnico.reduce((acc, dat) => ({ ...acc, [`modalidatrabajo_${dat}`]: '0%' }), {}),
      ...describirOrganizacionUnico.reduce((acc, dat) => ({ ...acc, [`describirorganizacion_${dat}`]: '0%' }), {}),
      ...areaUnico.reduce((acc, dat) => ({ ...acc, [`areaT_${dat}`]: '0%' }), {}),
      ...cargoUnico.reduce((acc, dat) => ({ ...acc, [`cargoT_${dat}`]: '0%' }), {}),
      ...cargoMologadoUnico.reduce((acc, dat) => ({ ...acc, [`cargomologado_${dat}`]: '0%' }), {}),
      ...educacionUnico.reduce((acc, dat) => ({ ...acc, [`educacion_${dat}`]: '0%' }), {}),
      ...generacionUnico.reduce((acc, dat) => ({ ...acc, [`generacion_${dat}`]: '0%' }), {}),
      ...nivelE1Unico.reduce((acc, dat) => ({ ...acc, [`nivele1_${dat}`]: '0%' }), {}),
      ...nivelE2Unico.reduce((acc, dat) => ({ ...acc, [`nivele2_${dat}`]: '0%' }), {}),
      ...nivelE3Unico.reduce((acc, dat) => ({ ...acc, [`nivele3_${dat}`]: '0%' }), {}),
      ...nivelE4Unico.reduce((acc, dat) => ({ ...acc, [`nivele4_${dat}`]: '0%' }), {}),
      ...nivelE5Unico.reduce((acc, dat) => ({ ...acc, [`nivele5_${dat}`]: '0%' }), {}),
      ...nivelE6Unico.reduce((acc, dat) => ({ ...acc, [`nivele6_${dat}`]: '0%' }), {}),
      ...nivelE7Unico.reduce((acc, dat) => ({ ...acc, [`nivele7_${dat}`]: '0%' }), {}),
      ...nivelE8Unico.reduce((acc, dat) => ({ ...acc, [`nivele8_${dat}`]: '0%' }), {}),
      ...nivelE9Unico.reduce((acc, dat) => ({ ...acc, [`nivele9_${dat}`]: '0%' }), {}),
      ...nivelE10Unico.reduce((acc, dat) => ({ ...acc, [`nivele10_${dat}`]: '0%' }), {}),
      ...paisUnico.reduce((acc, dat) => ({ ...acc, [`pais_${dat}`]: '0%' }), {}),
      ...localidad1Unico.reduce((acc, dat) => ({ ...acc, [`local1_${dat}`]: '0%' }), {}),
      ...localidad2Unico.reduce((acc, dat) => ({ ...acc, [`local2_${dat}`]: '0%' }), {}),
      ...lideresUnico.reduce((acc, dat) => ({ ...acc, [`lideres_${dat}`]: '0%' }), {}),
      expandable: false,
    };

    lideresUnico.forEach(data => {
      if (!overallLideres.value[data]) {
        overallLideres.value[data] = 0;
      }
    });
    // Mapear los géneros únicos a un objeto que contenga los datos agrupados por lider
    lideresUnico.forEach(dat => {
      const lidData = lideresMap[dat] || [];
      let sumGeneroCount = 0;
      if(lidData.length >= 3) {
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorLid = lidData.map(item => item.bdbdo10id.bdid);
  
  
        // Filtramos los valores en `generosCount` por `bdinfid` según el género
        const generoFilteredCount = generosCount.value.filter(gen => 
          idsPorLid.includes(gen.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
          idsPorLid.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const generoCount = generoFilteredCount.filter(gen => 
          gen.bdinfindxvcn >= 4
        ).length;
  
        if (generoCountValue.length != 0) {
          const porcentaje = (generoCountValue.length * 100) / generoFilteredCount.length;
      
          // Acumular el porcentaje en la suma
          sumGeneroCount += porcentaje;
          afirmacion[`lideres_${dat}`] = `${(((generoCountValue.length * 100)/ generoFilteredCount.length)).toFixed(0) || 0}%`;
        } else {
          afirmacion[`lideres_${dat}`] = `0%`;
        }
  
         // Acumular valores en el mapa de géneros
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let generoData = competencialideresMap.get(`${lindidlin}-${indclasifi}`)[dat];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionlideresMap.get(`${dimid}-${lindidlin}`)[dat];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionlideresMap.get(dimid)[dat];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionlideresMap.get(dimid)[dat] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
      overallLideres.value[dat] += sumGeneroCount/55;
    });
    generosUnicos.forEach(genero => {
      const genData = generoMap[genero] || [];
      const idsValores = genData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`genero_${genero}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`genero_${genero}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`genero_${genero}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`genero_${genero}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`genero_${genero}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`

      if(genData.length >= 3) {
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorGenero = genData.map(item => item.bid.bdinfid);
        
        // Filtramos los valores en `generosCount` por `bdinfid` según el género
        const generoFilteredCount = generosCount.value.filter(gen => 
          idsPorGenero.includes(gen.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
          idsPorGenero.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const generoCount = generoFilteredCount.filter(gen => 
          gen.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`genero_${genero}`] = `${((generoCountValue.length * 100)/ generoFilteredCount.length).toFixed(0)}%`;
  
         // Acumular valores en el mapa de géneros
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let generoData = competenciaGeneroMap.get(`${lindidlin}-${indclasifi}`)[genero];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionGeneroMap.get(`${dimid}-${lindidlin}`)[genero];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionGeneroMap.get(dimid)[genero];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[genero] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }

      }
    });

    medioTransporteUnico.forEach(medioTransporte => {
      const mtransData = medioTransporteMap[medioTransporte] || [];
      const idsValores = mtransData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = medioTransporteCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`mediotransporte_${medioTransporte}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`mediotransporte_${medioTransporte}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`mediotransporte_${medioTransporte}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`mediotransporte_${medioTransporte}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`mediotransporte_${medioTransporte}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      if(mtransData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorMedioTransporte = mtransData.map(item => item.bid.bdinfid);
  
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const medioTransporteFilteredCount = medioTransporteCount.value.filter(mt => 
          idsPorMedioTransporte.includes(mt.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
          idsPorMedioTransporte.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const medioTransCount = medioTransporteFilteredCount.filter(mt => 
          mt.bdinfindxvcn >= 4 && mt.bdinfindxvcn <= 5
        ).length;
  
        afirmacion[`mediotransporte_${medioTransporte}`] = `${((generoCountValue.length * 100)/ medioTransporteFilteredCount.length).toFixed(0)}%`;
        
         // Acumular valores en el mapa de géneros
         if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciamedioTransporteMap.get(`${lindidlin}-${indclasifi}`)[medioTransporte];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciamedioTransporteMap.get(`${lindidlin}-${indclasifi}`)[medioTransporte] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionmedioTransporteMap.get(`${dimid}-${lindidlin}`)[medioTransporte];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionmedioTransporteMap.get(dimid)[medioTransporte];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[medioTransporte] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }

      }
    });

    tiempoLlegadaUnico.forEach(tiempoLleg => {
      const tLlegData = tiempoLlegadaMap[tiempoLleg] || [];
      const idsValores = tLlegData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = tiempoLlegadaCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`tiempollegada_${tiempoLleg}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`tiempollegada_${tiempoLleg}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`tiempollegada_${tiempoLleg}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`tiempollegada_${tiempoLleg}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`tiempollegada_${tiempoLleg}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(tLlegData.length >= 3) {
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorTiempoLlegada = tLlegData.map(item => item.bid.bdinfid);
  
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const tiempoLlegadaFilteredCount = tiempoLlegadaCount.value.filter(mt => 
          idsPorTiempoLlegada.includes(mt.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
          idsPorTiempoLlegada.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const tiempLlegCount = tiempoLlegadaFilteredCount.filter(tlfc => 
          tlfc.bdinfindxvcn >= 4
        ).length;

        afirmacion[`tiempollegada_${tiempoLleg}`] = `${((generoCountValue.length * 100)/ tiempoLlegadaFilteredCount.length).toFixed(0)}%`;
  
  
        // Acumular valores en el mapa de géneros
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciatiempoLlegadaMap.get(`${lindidlin}-${indclasifi}`)[tiempoLleg];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciatiempoLlegadaMap.get(`${lindidlin}-${indclasifi}`)[tiempoLleg] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensiontiempoLlegadaMap.get(`${dimid}-${lindidlin}`)[tiempoLleg];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensiontiempoLlegadaMap.get(dimid)[tiempoLleg];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[tiempoLleg] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    cantidadReunionesUnico.forEach(cantidadReu => {
      const cReunData = cantidadReunionesMap[cantidadReu] || [];
      const idsValores = cReunData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = cantidadReunionesCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`reunionesjefe_${cantidadReu}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`reunionesjefe_${cantidadReu}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`reunionesjefe_${cantidadReu}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`reunionesjefe_${cantidadReu}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`reunionesjefe_${cantidadReu}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(cReunData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorCantidadReuniones = cReunData.map(item => item.bid.bdinfid);
  
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        //console.log('cantidadReunionesCount', cantidadReunionesCount);
        const cantidadReunionesFilteredCount = cantidadReunionesCount.value.filter(crc => 
          idsPorCantidadReuniones.includes(crc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
          idsPorCantidadReuniones.includes(gen.bid.bdinfid)
        );
        
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const cantidReuCount = cantidadReunionesFilteredCount.filter(crfc => 
          crfc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`reunionesjefe_${cantidadReu}`] = `${((generoCountValue.length * 100)/ cantidadReunionesFilteredCount.length).toFixed(0)}%`;
        // Acumular valores en el mapa de géneros
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciacantidadReunionesMap.get(`${lindidlin}-${indclasifi}`)[cantidadReu];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciacantidadReunionesMap.get(`${lindidlin}-${indclasifi}`)[cantidadReu] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensioncantidadReunionesMap.get(`${dimid}-${lindidlin}`)[cantidadReu];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensioncantidadReunionesMap.get(dimid)[cantidadReu];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[cantidadReu] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }

      }
      
    });

    oportunidadesMejoraUnico.forEach(oportMej => {
      const oMejoraData = oportunidadesMejoraMap[oportMej] || [];
      const idsValores = oMejoraData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = oportunidadesMejoraCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`oportunidadesmejora_${oportMej}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`oportunidadesmejora_${oportMej}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`oportunidadesmejora_${oportMej}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`oportunidadesmejora_${oportMej}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`oportunidadesmejora_${oportMej}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(oMejoraData.length >= 3){

        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorOportunidadesMejora = oMejoraData.map(item => item.bid.bdinfid);
  
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        //console.log('cantidadReunionesCount', cantidadReunionesCount);
        const oportunidadesMejoraFilteredCount = oportunidadesMejoraCount.value.filter(omc => 
          idsPorOportunidadesMejora.includes(omc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
          idsPorOportunidadesMejora.includes(gen.bid.bdinfid)
        );
        
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const oportMejCount = oportunidadesMejoraFilteredCount.filter(omfc => 
          omfc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`oportunidadesmejora_${oportMej}`] = `${((generoCountValue.length * 100)/ oportunidadesMejoraFilteredCount.length).toFixed(0)}%`;
  
        // Acumular valores en el mapa de géneros
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciaoportunidadesMejoraMap.get(`${lindidlin}-${indclasifi}`)[oportMej];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciaoportunidadesMejoraMap.get(`${lindidlin}-${indclasifi}`)[oportMej] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionoportunidadesMejoraMap.get(`${dimid}-${lindidlin}`)[oportMej];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionoportunidadesMejoraMap.get(dimid)[oportMej];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[oportMej] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    seguirDesarrollandomeUnico.forEach(segDes => {
      const sDesarrollandomeData = seguirDesarrollandomeMap[segDes] || [];
      const idsValores = sDesarrollandomeData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = seguirDesarrollandomeCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`seguirdesarrollandome_${segDes}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`seguirdesarrollandome_${segDes}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`seguirdesarrollandome_${segDes}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`seguirdesarrollandome_${segDes}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`seguirdesarrollandome_${segDes}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(sDesarrollandomeData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorSeguirDesarrollandome = sDesarrollandomeData.map(item => item.bid.bdinfid);
  
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        //console.log('cantidadReunionesCount', cantidadReunionesCount);
        const seguirDesarrollandomeFilteredCount = seguirDesarrollandomeCount.value.filter(sdc => 
          idsPorSeguirDesarrollandome.includes(sdc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
          idsPorSeguirDesarrollandome.includes(gen.bid.bdinfid)
        );
        
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const segDesCount = seguirDesarrollandomeFilteredCount.filter(sdfc => 
          sdfc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`seguirdesarrollandome_${segDes}`] = `${((generoCountValue.length * 100)/ seguirDesarrollandomeFilteredCount.length).toFixed(0)}%`;
        
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciaseguirDesarrollandomeMap.get(`${lindidlin}-${indclasifi}`)[segDes];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciaseguirDesarrollandomeMap.get(`${lindidlin}-${indclasifi}`)[segDes] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionseguirDesarrollandomeMap.get(`${dimid}-${lindidlin}`)[segDes];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionseguirDesarrollandomeMap.get(dimid)[segDes];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[segDes] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    oportunidadesEmpleoUnico.forEach(opEmp => {
      const oEmpleoData = oportunidadesEmpleoMap[opEmp] || [];
      const idsValores = oEmpleoData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = oportunidadesEmpleoCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`oportunidadesempleo_${opEmp}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`oportunidadesempleo_${opEmp}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`oportunidadesempleo_${opEmp}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`oportunidadesempleo_${opEmp}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`oportunidadesempleo_${opEmp}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(oEmpleoData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorSeguirOportunidadesEmpleo = oEmpleoData.map(item => item.bid.bdinfid);
  
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        //console.log('cantidadReunionesCount', cantidadReunionesCount);
        const oportunidadesEmpleoFilteredCount = oportunidadesEmpleoCount.value.filter(oec => 
          idsPorSeguirOportunidadesEmpleo.includes(oec.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
          idsPorSeguirOportunidadesEmpleo.includes(gen.bid.bdinfid)
        );
        
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const opEmpCount = oportunidadesEmpleoFilteredCount.filter(oefc => 
          oefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`oportunidadesempleo_${opEmp}`] = `${((generoCountValue.length * 100)/ oportunidadesEmpleoFilteredCount.length).toFixed(0)}%`;
        
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciaoportunidadesEmpleoMap.get(`${lindidlin}-${indclasifi}`)[opEmp];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciaoportunidadesEmpleoMap.get(`${lindidlin}-${indclasifi}`)[opEmp] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionoportunidadesEmpleoMap.get(`${dimid}-${lindidlin}`)[opEmp];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionoportunidadesEmpleoMap.get(dimid)[opEmp];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[opEmp] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    cantidadEmpleosUnico.forEach(cantEmp => {
      const cantEmpleoData = cantidadEmpleosMap[cantEmp] || [];
      const idsValores = cantEmpleoData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = cantidadEmpleosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`cantidadempleos_${cantEmp}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`cantidadempleos_${cantEmp}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`cantidadempleos_${cantEmp}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`cantidadempleos_${cantEmp}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`cantidadempleos_${cantEmp}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(cantEmpleoData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorSeguirCantidadEmpleo = cantEmpleoData.map(item => item.bid.bdinfid);
  
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const cantidadEmpleoFilteredCount = cantidadEmpleosCount.value.filter(cec => 
          idsPorSeguirCantidadEmpleo.includes(cec.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
          idsPorSeguirCantidadEmpleo.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const canEmpCount = cantidadEmpleoFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`cantidadempleos_${cantEmp}`] = `${((generoCountValue.length * 100)/ cantidadEmpleoFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciacantidadEmpleosMap.get(`${lindidlin}-${indclasifi}`)[cantEmp];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciacantidadEmpleosMap.get(`${lindidlin}-${indclasifi}`)[cantEmp] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensioncantidadEmpleosMap.get(`${dimid}-${lindidlin}`)[cantEmp];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensioncantidadEmpleosMap.get(dimid)[cantEmp];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[cantEmp] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    padecimientoSaludUnico.forEach(padSal => {
      const padSaludData = padecimientoSaludMap[padSal] || [];
      const idsValores = padSaludData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = padecimientoSaludCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`padecimientosalud_${padSal}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`padecimientosalud_${padSal}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`padecimientosalud_${padSal}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`padecimientosalud_${padSal}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`padecimientosalud_${padSal}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(padSaludData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorSeguirPadecimientoSalud = padSaludData.map(item => item.bid.bdinfid);
  
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const padecimientoSaludFilteredCount = padecimientoSaludCount.value.filter(psc => 
          idsPorSeguirPadecimientoSalud.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
          idsPorSeguirPadecimientoSalud.includes(gen.bid.bdinfid)
        );
        
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const canEmpCount = padecimientoSaludFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`padecimientosalud_${padSal}`] = `${((generoCountValue.length * 100)/ padecimientoSaludFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciapadecimientoSaludMap.get(`${lindidlin}-${indclasifi}`)[padSal];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciapadecimientoSaludMap.get(`${lindidlin}-${indclasifi}`)[padSal] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionpadecimientoSaludMap.get(`${dimid}-${lindidlin}`)[padSal];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionpadecimientoSaludMap.get(dimid)[padSal];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[padSal] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    dependientesEconomicosUnico.forEach(depEcon => {
      const depEconData = dependientesEconomicosMap[depEcon] || [];
      const idsValores = depEconData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = dependientesEconomicosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`dependienteseconomicos_${depEcon}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`dependienteseconomicos_${depEcon}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`dependienteseconomicos_${depEcon}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`dependienteseconomicos_${depEcon}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`dependienteseconomicos_${depEcon}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      

      if(depEconData.length >= 3){
        const idsPorSeguirDependientesEconomicos = depEconData.map(item => item.bid.bdinfid);
  
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const dependientesEconomicosFilteredCount = dependientesEconomicosCount.value.filter(psc => 
          idsPorSeguirDependientesEconomicos.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
          idsPorSeguirDependientesEconomicos.includes(gen.bid.bdinfid)
        );
        
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const depEconCount = dependientesEconomicosFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`dependienteseconomicos_${depEcon}`] = `${((generoCountValue.length * 100)/ dependientesEconomicosFilteredCount.length).toFixed(0)}%`;
      
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciadependientesEconomicosMap.get(`${lindidlin}-${indclasifi}`)[depEcon];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciadependientesEconomicosMap.get(`${lindidlin}-${indclasifi}`)[depEcon] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensiondependientesEconomicosMap.get(`${dimid}-${lindidlin}`)[depEcon];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensiondependientesEconomicosMap.get(dimid)[depEcon];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[depEcon] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });
    
    tiempoGenteACargoUnico.forEach(tiemGente => {
      const tiemGenteData = tiempoGenteACargoMap[tiemGente] || [];
      const idsValores = tiemGenteData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = tiempoGenteACargoCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`tiempogente_${tiemGente}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`tiempogente_${tiemGente}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`tiempogente_${tiemGente}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`tiempogente_${tiemGente}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`tiempogente_${tiemGente}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(tiemGenteData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorSeguirTiempoGente = tiemGenteData.map(item => item.bid.bdinfid);
  
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const tiempoGenteFilteredCount = tiempoGenteACargoCount.value.filter(psc => 
          idsPorSeguirTiempoGente.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
          idsPorSeguirTiempoGente.includes(gen.bid.bdinfid)
        );
        
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const tiemGenteCount = tiempoGenteFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`tiempogente_${tiemGente}`] = `${((generoCountValue.length * 100)/ tiempoGenteFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciatiempoGenteACargoMap.get(`${lindidlin}-${indclasifi}`)[tiemGente];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciatiempoGenteACargoMap.get(`${lindidlin}-${indclasifi}`)[tiemGente] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensiontiempoGenteACargoMap.get(`${dimid}-${lindidlin}`)[tiemGente];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensiontiempoGenteACargoMap.get(dimid)[tiemGente];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[tiemGente] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
      
    });

    modalidadTrabajoUnico.forEach(modalidad => {
      const modalTrabData = modalidadTrabajoMap[modalidad] || [];
      const idsValores = modalTrabData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = modalidadTrabajoCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`modalidatrabajo_${modalidad}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`modalidatrabajo_${modalidad}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`modalidatrabajo_${modalidad}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`modalidatrabajo_${modalidad}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`modalidatrabajo_${modalidad}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(modalTrabData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorSeguirModalidadTrabajo = modalTrabData.map(item => item.bid.bdinfid);
  
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const modalidadTrabajoFilteredCount = modalidadTrabajoCount.value.filter(psc => 
          idsPorSeguirModalidadTrabajo.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorSeguirModalidadTrabajo.includes(gen.bid.bdinfid)
        );
        
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const modalidadTrabCount = modalidadTrabajoFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`modalidatrabajo_${modalidad}`] = `${((generoCountValue.length * 100)/ modalidadTrabajoFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciamodalidadTrabajoMap.get(`${lindidlin}-${indclasifi}`)[modalidad];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciamodalidadTrabajoMap.get(`${lindidlin}-${indclasifi}`)[modalidad] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionmodalidadTrabajoMap.get(`${dimid}-${lindidlin}`)[modalidad];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionmodalidadTrabajoMap.get(dimid)[modalidad];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[modalidad] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
      
    });

    describirOrganizacionUnico.forEach(descOrg => {
      const descOrgData = describirOrganizacionMap[descOrg] || [];
      const idsValores = descOrgData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = describirOrganizacionCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`describirorganizacion_${descOrg}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`describirorganizacion_${descOrg}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`describirorganizacion_${descOrg}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`describirorganizacion_${descOrg}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`describirorganizacion_${descOrg}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(descOrgData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorSeguirDescrbOrg = descOrgData.map(item => item.bid.bdinfid);
  
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const descOrgFilteredCount = describirOrganizacionCount.value.filter(psc => 
          idsPorSeguirDescrbOrg.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorSeguirDescrbOrg.includes(gen.bid.bdinfid)
        );
        
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const descOrgCount = descOrgFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`describirorganizacion_${descOrg}`] = `${((generoCountValue.length * 100)/ descOrgFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciadescribirOrganizacionMap.get(`${lindidlin}-${indclasifi}`)[descOrg];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciadescribirOrganizacionMap.get(`${lindidlin}-${indclasifi}`)[descOrg] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensiondescribirOrganizacionMap.get(`${dimid}-${lindidlin}`)[descOrg];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensiondescribirOrganizacionMap.get(dimid)[descOrg];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[descOrg] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    areaUnico.forEach(areaT => {
      const areaTData = areaMap[areaT] || [];
      const idsValores = areaTData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`areaT_${areaT}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`areaT_${areaT}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`areaT_${areaT}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`areaT_${areaT}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`areaT_${areaT}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(areaTData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorAreaT = areaTData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const areaTFilteredCount = generosCount.value.filter(psc => 
          idsPorAreaT.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorAreaT.includes(gen.bid.bdinfid)
        );
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const areaTCount = areaTFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`areaT_${areaT}`] = `${((generoCountValue.length * 100)/ areaTFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciaareaMap.get(`${lindidlin}-${indclasifi}`)[areaT];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciaareaMap.get(`${lindidlin}-${indclasifi}`)[areaT] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionareaMap.get(`${dimid}-${lindidlin}`)[areaT];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionareaMap.get(dimid)[areaT];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[areaT] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    cargoUnico.forEach(cargoT => {
      const cargoTData = cargoMap[cargoT] || [];
      const idsValores = cargoTData.map(item => item.bdbdo10id.bdid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`cargoT_${cargoT}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`cargoT_${cargoT}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`cargoT_${cargoT}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`cargoT_${cargoT}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`cargoT_${cargoT}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(cargoTData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorCargoT = cargoTData.map(item => item.bdbdo10id.bdid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const cargoTFilteredCount = generosCount.value.filter(psc => 
          idsPorCargoT.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorCargoT.includes(gen.bid.bdinfid)
        );
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const cargoTCount = cargoTFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`cargoT_${cargoT}`] = `${((generoCountValue.length * 100)/ cargoTFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciacargoMap.get(`${lindidlin}-${indclasifi}`)[cargoT];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciacargoMap.get(`${lindidlin}-${indclasifi}`)[cargoT] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensioncargoMap.get(`${dimid}-${lindidlin}`)[cargoT];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensioncargoMap.get(dimid)[cargoT];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[cargoT] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    cargoMologadoUnico.forEach(cargoMologado => {
      const cargoMolData = cargoMologadoMap[cargoMologado] || [];
      const idsValores = cargoMolData.map(item => item.bdbdo10id.bdid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`cargomologado_${cargoMologado}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`cargomologado_${cargoMologado}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`cargomologado_${cargoMologado}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`cargomologado_${cargoMologado}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`cargomologado_${cargoMologado}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(cargoMolData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorCargoMol = cargoMolData.map(item => item.bdbdo10id.bdid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const cargoMolFilteredCount = generosCount.value.filter(psc => 
          idsPorCargoMol.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorCargoMol.includes(gen.bid.bdinfid)
        );
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const cargoMolCount = cargoMolFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`cargomologado_${cargoMologado}`] = `${((generoCountValue.length * 100)/ cargoMolFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciacargoMologadoMap.get(`${lindidlin}-${indclasifi}`)[cargoMologado];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciacargoMologadoMap.get(`${lindidlin}-${indclasifi}`)[cargoMologado] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensioncargoMologadoMap.get(`${dimid}-${lindidlin}`)[cargoMologado];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensioncargoMologadoMap.get(dimid)[cargoMologado];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[cargoMologado] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    educacionUnico.forEach(educacion => {
      const educacionData = educacionMap[educacion] || [];
      const idsValores = educacionData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`educacion_${educacion}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`educacion_${educacion}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`educacion_${educacion}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`educacion_${educacion}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`educacion_${educacion}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(educacionData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorEducacion = educacionData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const educacionFilteredCount = generosCount.value.filter(psc => 
          idsPorEducacion.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorEducacion.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const educacionCount = educacionFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`educacion_${educacion}`] = `${((generoCountValue.length * 100)/ educacionFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciaeducacionMap.get(`${lindidlin}-${indclasifi}`)[educacion];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciaeducacionMap.get(`${lindidlin}-${indclasifi}`)[educacion] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensioneducacionMap.get(`${dimid}-${lindidlin}`)[educacion];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensioneducacionMap.get(dimid)[educacion];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[educacion] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    generacionUnico.forEach(generac => {
      const generacionData = generacionMap[generac] || [];
      const idsValores = generacionData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`generacion_${generac}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`generacion_${generac}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`generacion_${generac}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`generacion_${generac}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`generacion_${generac}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(generacionData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorGeneracion = generacionData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const generacionFilteredCount = generosCount.value.filter(psc => 
          idsPorGeneracion.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorGeneracion.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const educacionCount = generacionFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`generacion_${generac}`] = `${((generoCountValue.length * 100)/ generacionFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciageneracionMap.get(`${lindidlin}-${indclasifi}`)[generac];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciaeducacionMap.get(`${lindidlin}-${indclasifi}`)[generac] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensiongeneracionMap.get(`${dimid}-${lindidlin}`)[generac];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensiongeneracionMap.get(dimid)[generac];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[generac] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    nivelE1Unico.forEach(nivelEst => {
      const nivelEsData = nivelE1Map[nivelEst] || [];
      const idsValores = nivelEsData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`nivele1_${nivelEst}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele1_${nivelEst}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele1_${nivelEst}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele1_${nivelEst}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele1_${nivelEst}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(nivelEsData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorNivelEst = nivelEsData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const nivelEsFilteredCount = generosCount.value.filter(psc => 
          idsPorNivelEst.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorNivelEst.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const educacionCount = nivelEsFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`nivele1_${nivelEst}`] = `${((generoCountValue.length * 100)/ nivelEsFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competencianivelE1Map.get(`${lindidlin}-${indclasifi}`)[nivelEst];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competencianivelE1Map.get(`${lindidlin}-${indclasifi}`)[nivelEst] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionnivelE1Map.get(`${dimid}-${lindidlin}`)[nivelEst];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionnivelE1Map.get(dimid)[nivelEst];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[nivelEst] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    nivelE2Unico.forEach(nivelEst => {
      const nivelEsData = nivelE2Map[nivelEst] || [];
      const idsValores = nivelEsData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`nivele2_${nivelEst}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele2_${nivelEst}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele2_${nivelEst}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele2_${nivelEst}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele2_${nivelEst}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(nivelEsData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorNivelEst = nivelEsData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const nivelEsFilteredCount = generosCount.value.filter(psc => 
          idsPorNivelEst.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorNivelEst.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const educacionCount = nivelEsFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`nivele2_${nivelEst}`] = `${((generoCountValue.length * 100)/ nivelEsFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competencianivelE2Map.get(`${lindidlin}-${indclasifi}`)[nivelEst];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competencianivelE2Map.get(`${lindidlin}-${indclasifi}`)[nivelEst] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionnivelE2Map.get(`${dimid}-${lindidlin}`)[nivelEst];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionnivelE2Map.get(dimid)[nivelEst];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[nivelEst] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    nivelE3Unico.forEach(nivelEst => {
      const nivelEsData = nivelE3Map[nivelEst] || [];
      const idsValores = nivelEsData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`nivele3_${nivelEst}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele3_${nivelEst}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele3_${nivelEst}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele3_${nivelEst}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele3_${nivelEst}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(nivelEsData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorNivelEst = nivelEsData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const nivelEsFilteredCount = generosCount.value.filter(psc => 
          idsPorNivelEst.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorNivelEst.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const educacionCount = nivelEsFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`nivele3_${nivelEst}`] = `${((generoCountValue.length * 100)/ nivelEsFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competencianivelE3Map.get(`${lindidlin}-${indclasifi}`)[nivelEst];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competencianivelE3Map.get(`${lindidlin}-${indclasifi}`)[nivelEst] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionnivelE3Map.get(`${dimid}-${lindidlin}`)[nivelEst];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionnivelE3Map.get(dimid)[nivelEst];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[nivelEst] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    nivelE4Unico.forEach(nivelEst => {
      const nivelEsData = nivelE4Map[nivelEst] || [];
      const idsValores = nivelEsData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`nivele4_${nivelEst}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele4_${nivelEst}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele4_${nivelEst}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele4_${nivelEst}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele4_${nivelEst}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(nivelEsData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorNivelEst = nivelEsData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const nivelEsFilteredCount = generosCount.value.filter(psc => 
          idsPorNivelEst.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorNivelEst.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const educacionCount = nivelEsFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`nivele4_${nivelEst}`] = `${((generoCountValue.length * 100)/ nivelEsFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competencianivelE4Map.get(`${lindidlin}-${indclasifi}`)[nivelEst];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competencianivelE4Map.get(`${lindidlin}-${indclasifi}`)[nivelEst] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionnivelE4Map.get(`${dimid}-${lindidlin}`)[nivelEst];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionnivelE4Map.get(dimid)[nivelEst];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[nivelEst] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    nivelE5Unico.forEach(nivelEst => {
      const nivelEsData = nivelE5Map[nivelEst] || [];
      const idsValores = nivelEsData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`nivele5_${nivelEst}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele5_${nivelEst}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele5_${nivelEst}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele5_${nivelEst}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele5_${nivelEst}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(nivelEsData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorNivelEst = nivelEsData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const nivelEsFilteredCount = generosCount.value.filter(psc => 
          idsPorNivelEst.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorNivelEst.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const educacionCount = nivelEsFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`nivele5_${nivelEst}`] = `${((generoCountValue.length * 100)/ nivelEsFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competencianivelE5Map.get(`${lindidlin}-${indclasifi}`)[nivelEst];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competencianivelE5Map.get(`${lindidlin}-${indclasifi}`)[nivelEst] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionnivelE5Map.get(`${dimid}-${lindidlin}`)[nivelEst];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionnivelE5Map.get(dimid)[nivelEst];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[nivelEst] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    nivelE6Unico.forEach(nivelEst => {
      const nivelEsData = nivelE6Map[nivelEst] || [];
      const idsValores = nivelEsData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`nivele6_${nivelEst}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele6_${nivelEst}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele6_${nivelEst}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele6_${nivelEst}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele6_${nivelEst}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(nivelEsData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorNivelEst = nivelEsData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const nivelEsFilteredCount = generosCount.value.filter(psc => 
          idsPorNivelEst.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorNivelEst.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const educacionCount = nivelEsFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`nivele6_${nivelEst}`] = `${((generoCountValue.length * 100)/ nivelEsFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competencianivelE6Map.get(`${lindidlin}-${indclasifi}`)[nivelEst];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competencianivelE6Map.get(`${lindidlin}-${indclasifi}`)[nivelEst] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionnivelE6Map.get(`${dimid}-${lindidlin}`)[nivelEst];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionnivelE6Map.get(dimid)[nivelEst];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[nivelEst] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    nivelE7Unico.forEach(nivelEst => {
      const nivelEsData = nivelE7Map[nivelEst] || [];
      const idsValores = nivelEsData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`nivele7_${nivelEst}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele7_${nivelEst}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele7_${nivelEst}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele7_${nivelEst}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele7_${nivelEst}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(nivelEsData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorNivelEst = nivelEsData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const nivelEsFilteredCount = generosCount.value.filter(psc => 
          idsPorNivelEst.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorNivelEst.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const educacionCount = nivelEsFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`nivele7_${nivelEst}`] = `${((generoCountValue.length * 100)/ nivelEsFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competencianivelE7Map.get(`${lindidlin}-${indclasifi}`)[nivelEst];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competencianivelE7Map.get(`${lindidlin}-${indclasifi}`)[nivelEst] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionnivelE7Map.get(`${dimid}-${lindidlin}`)[nivelEst];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionnivelE7Map.get(dimid)[nivelEst];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[nivelEst] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    nivelE8Unico.forEach(nivelEst => {
      const nivelEsData = nivelE8Map[nivelEst] || [];
      const idsValores = nivelEsData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`nivele8_${nivelEst}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele8_${nivelEst}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele8_${nivelEst}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele8_${nivelEst}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele8_${nivelEst}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(nivelEsData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorNivelEst = nivelEsData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const nivelEsFilteredCount = generosCount.value.filter(psc => 
          idsPorNivelEst.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorNivelEst.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const educacionCount = nivelEsFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`nivele8_${nivelEst}`] = `${((generoCountValue.length * 100)/ nivelEsFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competencianivelE8Map.get(`${lindidlin}-${indclasifi}`)[nivelEst];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competencianivelE8Map.get(`${lindidlin}-${indclasifi}`)[nivelEst] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionnivelE8Map.get(`${dimid}-${lindidlin}`)[nivelEst];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionnivelE8Map.get(dimid)[nivelEst];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[nivelEst] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    nivelE9Unico.forEach(nivelEst => {
      const nivelEsData = nivelE9Map[nivelEst] || [];
      const idsValores = nivelEsData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`nivele9_${nivelEst}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele9_${nivelEst}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele9_${nivelEst}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele9_${nivelEst}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele9_${nivelEst}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(nivelEsData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorNivelEst = nivelEsData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const nivelEsFilteredCount = generosCount.value.filter(psc => 
          idsPorNivelEst.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorNivelEst.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const educacionCount = nivelEsFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`nivele9_${nivelEst}`] = `${((generoCountValue.length * 100)/ nivelEsFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competencianivelE9Map.get(`${lindidlin}-${indclasifi}`)[nivelEst];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competencianivelE9Map.get(`${lindidlin}-${indclasifi}`)[nivelEst] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionnivelE9Map.get(`${dimid}-${lindidlin}`)[nivelEst];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionnivelE9Map.get(dimid)[nivelEst];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[nivelEst] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    nivelE10Unico.forEach(nivelEst => {
      const nivelEsData = nivelE10Map[nivelEst] || [];
      const idsValores = nivelEsData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`nivele10_${nivelEst}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele10_${nivelEst}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele10_${nivelEst}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele10_${nivelEst}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`nivele10_${nivelEst}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(nivelEsData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorNivelEst = nivelEsData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const nivelEsFilteredCount = generosCount.value.filter(psc => 
          idsPorNivelEst.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorNivelEst.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const educacionCount = nivelEsFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
        const educacionVal1 = nivelEsFilteredCount.filter(cefc =>
          cefc.bdinfindxvcn === 1
        ).length;
        const educacionVal2 = nivelEsFilteredCount.filter(cefc =>
          cefc.bdinfindxvcn === 2
        ).length;
        const educacionVal3 = nivelEsFilteredCount.filter(cefc =>
          cefc.bdinfindxvcn === 3
        ).length;
        const educacionVal4 = nivelEsFilteredCount.filter(cefc =>
          cefc.bdinfindxvcn === 4
        ).length;
        const educacionVal5 = nivelEsFilteredCount.filter(cefc =>
          cefc.bdinfindxvcn === 5
        ).length;
  
        afirmacion[`nivele10_${nivelEst}`] = `${((generoCountValue.length * 100)/ nivelEsFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competencianivelE10Map.get(`${lindidlin}-${indclasifi}`)[nivelEst];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competencianivelE10Map.get(`${lindidlin}-${indclasifi}`)[nivelEst] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionnivelE10Map.get(`${dimid}-${lindidlin}`)[nivelEst];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionnivelE10Map.get(dimid)[nivelEst];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[nivelEst] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    paisUnico.forEach(paisU => {
      const paisUData = paisMap[paisU] || [];
      const idsValores = paisUData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`pais_${paisU}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`pais_${paisU}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`pais_${paisU}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`pais_${paisU}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`pais_${paisU}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(paisUData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorPais = paisUData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const paisFilteredCount = generosCount.value.filter(psc => 
          idsPorPais.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorPais.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const paisCount = paisFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`pais_${paisU}`] = `${((generoCountValue.length * 100)/ paisFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competenciapaisMap.get(`${lindidlin}-${indclasifi}`)[paisU];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competenciapaisMap.get(`${lindidlin}-${indclasifi}`)[paisU] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionpaisMap.get(`${dimid}-${lindidlin}`)[paisU];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionpaisMap.get(dimid)[paisU];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[paisU] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    localidad1Unico.forEach(local1 => {
      const localData = localidad1Map[local1] || [];
      const idsValores = localData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`local1_${local1}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`local1_${local1}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`local1_${local1}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`local1_${local1}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`local1_${local1}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(localData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorLocal = localData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const localFilteredCount = generosCount.value.filter(psc => 
          idsPorLocal.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorLocal.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const localCount = localFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`local1_${local1}`] = `${((generoCountValue.length * 100)/ localFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competencialocalidad1Map.get(`${lindidlin}-${indclasifi}`)[local1];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competencialocalidad1Map.get(`${lindidlin}-${indclasifi}`)[local1] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionlocalidad1Map.get(`${dimid}-${lindidlin}`)[local1];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionlocalidad1Map.get(dimid)[local1];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[local1] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    localidad2Unico.forEach(local1 => {
      const localData = localidad2Map[local1] || [];
      const idsValores = localData.map(item => item.bid.bdinfid);
      const valoresFilteredCount = generosCount.value.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue1 = afirmVal1.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue2 = afirmVal2.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue3 = afirmVal3.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue4 = afirmVal4.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );
      const valoresCountValue5 = afirmVal5.filter(gen => 
        idsValores.includes(gen.bid.bdinfid)
      );

      const demoVal1 = valoresCountValue1.filter(gen =>
          gen.bdinfindxvcn === 1
        ).length;
      const demoVal2 = valoresCountValue2.filter(gen =>
          gen.bdinfindxvcn === 2
        ).length;
      const demoVal3 = valoresCountValue3.filter(gen =>
          gen.bdinfindxvcn === 3
        ).length;
      const demoVal4 = valoresCountValue4.filter(gen =>
          gen.bdinfindxvcn === 4
        ).length;
      const demoVal5 = valoresCountValue5.filter(gen =>
          gen.bdinfindxvcn === 5
        ).length;

      afirmacion[`local2_${local1}_val1`] = `${((demoVal1*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`local2_${local1}_val2`] = `${((demoVal2*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`local2_${local1}_val3`] = `${((demoVal3*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`local2_${local1}_val4`] = `${((demoVal4*100)/valoresFilteredCount.length).toFixed(0)}%`
      afirmacion[`local2_${local1}_val5`] = `${((demoVal5*100)/valoresFilteredCount.length).toFixed(0)}%`
      
      if(localData.length >= 3){
        // Extraemos los `bdinfid` de las personas que respondieron el género actual
        const idsPorLocal = localData.map(item => item.bid.bdinfid);
        // Filtramos los valores en `medioTransCount` por `bdinfid` según el género
        const localFilteredCount = generosCount.value.filter(psc => 
          idsPorLocal.includes(psc.bid.bdinfid)
        );
        const generoCountValue = afirmaciones.filter(gen => 
        idsPorLocal.includes(gen.bid.bdinfid)
        );
  
        // Ahora podemos hacer los conteos según `bdinfindxvcn`
        const localCount = localFilteredCount.filter(cefc => 
          cefc.bdinfindxvcn >= 4
        ).length;
  
        afirmacion[`local2_${local1}`] = `${((generoCountValue.length * 100)/ localFilteredCount.length).toFixed(0)}%`;
  
        if (competenciaMap.has(`${lindidlin}-${indclasifi}`)) {
          let data = competencialocalidad2Map.get(`${lindidlin}-${indclasifi}`)[local1];
          // Si no existe, inicializamos medioTransporteData
          if (!data) {
            data = { total: 0, count: 0 };
            competencialocalidad2Map.get(`${lindidlin}-${indclasifi}`)[local1] = data; // Asignamos el objeto al map
          }
          data.total += generoCountValue.length;
          data.count += 1;
        }
  
        if (subDimensionMap.has(`${dimid}-${lindidlin}`)) {
          const generoData = subDimensionlocalidad2Map.get(`${dimid}-${lindidlin}`)[local1];
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
  
        if (dimensionMap.has(dimid)) {
          // Si no existe, inicializamos generoData
          let generoData = dimensionlocalidad2Map.get(dimid)[local1];
          if (!generoData) {
            generoData = { total: 0, count: 0 };
            dimensionGeneroMap.get(dimid)[local1] = generoData; // Asignamos el objeto al map
          }
          generoData.total += generoCountValue.length;
          generoData.count += 1;
        }
      }
    });

    formatted.push(afirmacion);
    const competenciaKey = `${lindidlin}-${indclasifi}`;
    const subDimKey = `${dimid}-${lindidlin}`;
    if (competenciaMap.has(competenciaKey)) {
      const competenciaData = competenciaMap.get(competenciaKey);
      competenciaData.totalResult += afirmaciones.length;
      competenciaData.count += 1;
      competenciaMap.set(competenciaKey, competenciaData);
    }

    if (subDimensionMap.has(subDimKey)) {
      const subDimensionData = subDimensionMap.get(subDimKey);
      subDimensionData.totalResult += afirmaciones.length;
      subDimensionData.count += 1;
      subDimensionMap.set(subDimKey, subDimensionData);
    }

    if (dimensionMap.has(dimid)) {
      const dimensionData = dimensionMap.get(dimid);
      dimensionData.totalResult += afirmaciones.length;
      dimensionData.count += 1;
      dimensionMap.set(dimid, dimensionData);
    }
  });
  console.log('overallLideres',overallLideres.value)
  // Calculate and set average results for Competencias
  formatted.forEach(item => {
    if (item.level === 'competencia') {
      const competenciaData = competenciaMap.get(item.id);
      if (competenciaData && competenciaData.count > 0 && cantidadRespuestas.value > 3) {
        item.resultado = `${(((competenciaData.totalResult * 100 )/ competenciaData.count)/cantidadRespuestas.value).toFixed(0)}%`;
      }
      // Cálculo por demograficos en competencias
      lideresUnico.forEach(data => {
        const lidData = competencialideresMap.get(item.id)[data];
        if (lidData.count > 0) {
          item[`lideres_${data}`] = `${(((lidData.total * 100) / lidData.count)/lideresMap[data].length).toFixed(0) >= 0 ? (
            (((lidData.total * 100) / lidData.count)/lideresMap[data].length).toFixed(0)
          ):(
            0
          )}%`;
        }
      });
      generosUnicos.forEach(genero => {
        const generoData = competenciaGeneroMap.get(item.id)[genero];
        if (generoData.count > 0) {
          item[`genero_${genero}`] = `${(((generoData.total * 100) / generoData.count)/generoMap[genero].length).toFixed(0)}%`;
        }
      });
      medioTransporteUnico.forEach(data => {
        const demoData = competenciamedioTransporteMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`mediotransporte_${data}`] = `${(((demoData.total * 100) / demoData.count)/medioTransporteMap[data].length).toFixed(0)}%`;
        }
      });
      tiempoLlegadaUnico.forEach(data => {
        const demoData = competenciatiempoLlegadaMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`tiempollegada_${data}`] = `${(((demoData.total * 100) / demoData.count)/tiempoLlegadaMap[data].length).toFixed(0)}%`;
        }
      });
      cantidadReunionesUnico.forEach(data => {
        const demoData = competenciacantidadReunionesMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`reunionesjefe_${data}`] = `${(((demoData.total * 100) / demoData.count)/cantidadReunionesMap[data].length).toFixed(0)}%`;
        }
      });
      oportunidadesMejoraUnico.forEach(data => {
        const demoData = competenciaoportunidadesMejoraMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`oportunidadesmejora_${data}`] = `${(((demoData.total * 100) / demoData.count)/oportunidadesMejoraMap[data].length).toFixed(0)}%`;
        }
      });
      seguirDesarrollandomeUnico.forEach(data => {
        const demoData = competenciaseguirDesarrollandomeMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`seguirdesarrollandome_${data}`] = `${(((demoData.total * 100) / demoData.count)/seguirDesarrollandomeMap[data].length).toFixed(0)}%`;
        }
      });
      oportunidadesEmpleoUnico.forEach(data => {
        const demoData = competenciaoportunidadesEmpleoMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`oportunidadesempleo_${data}`] = `${(((demoData.total * 100) / demoData.count)/oportunidadesEmpleoMap[data].length).toFixed(0)}%`;
        }
      });
      cantidadEmpleosUnico.forEach(data => {
        const demoData = competenciacantidadEmpleosMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`cantidadempleos_${data}`] = `${(((demoData.total * 100) / demoData.count)/cantidadEmpleosMap[data].length).toFixed(0)}%`;
        }
      });
      padecimientoSaludUnico.forEach(data => {
        const demoData = competenciapadecimientoSaludMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`padecimientosalud_${data}`] = `${(((demoData.total * 100) / demoData.count)/padecimientoSaludMap[data].length).toFixed(0)}%`;
        }
      });
      dependientesEconomicosUnico.forEach(data => {
        const demoData = competenciadependientesEconomicosMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`dependienteseconomicos_${data}`] = `${(((demoData.total * 100) / demoData.count)/dependientesEconomicosMap[data].length).toFixed(0)}%`;
        }
      });
      tiempoGenteACargoUnico.forEach(data => {
        const demoData = competenciatiempoGenteACargoMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`tiempogente_${data}`] = `${(((demoData.total * 100) / demoData.count)/tiempoGenteACargoMap[data].length).toFixed(0)}%`;
        }
      });
      modalidadTrabajoUnico.forEach(data => {
        const demoData = competenciamodalidadTrabajoMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`modalidatrabajo_${data}`] = `${(((demoData.total * 100) / demoData.count)/modalidadTrabajoMap[data].length).toFixed(0)}%`;
        }
      });
      describirOrganizacionUnico.forEach(data => {
        const demoData = competenciadescribirOrganizacionMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`describirorganizacion_${data}`] = `${(((demoData.total * 100) / demoData.count)/describirOrganizacionMap[data].length).toFixed(0)}%`;
        }
      });
      areaUnico.forEach(data => {
        const demoData = competenciaareaMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`areaT_${data}`] = `${(((demoData.total * 100) / demoData.count)/areaMap[data].length).toFixed(0)}%`;
        }
      });
      cargoUnico.forEach(data => {
        const demoData = competenciacargoMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`cargoT_${data}`] = `${(((demoData.total * 100) / demoData.count)/cargoMap[data].length).toFixed(0)}%`;
        }
      });
      cargoMologadoUnico.forEach(data => {
        const demoData = competenciacargoMologadoMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`cargomologado_${data}`] = `${(((demoData.total * 100) / demoData.count)/cargoMologadoMap[data].length).toFixed(0)}%`;
        }
      });
      educacionUnico.forEach(data => {
        const demoData = competenciaeducacionMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`educacion_${data}`] = `${(((demoData.total * 100) / demoData.count)/educacionMap[data].length).toFixed(0)}%`;
        }
      });
      generacionUnico.forEach(data => {
        const demoData = competenciageneracionMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`generacion_${data}`] = `${(((demoData.total * 100) / demoData.count)/generacionMap[data].length).toFixed(0)}%`;
        }
      });
      nivelE1Unico.forEach(data => {
        const demoData = competencianivelE1Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele1_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE1Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE2Unico.forEach(data => {
        const demoData = competencianivelE2Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele2_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE2Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE3Unico.forEach(data => {
        const demoData = competencianivelE3Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele3_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE3Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE4Unico.forEach(data => {
        const demoData = competencianivelE4Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele4_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE4Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE5Unico.forEach(data => {
        const demoData = competencianivelE5Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele5_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE5Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE6Unico.forEach(data => {
        const demoData = competencianivelE6Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele6_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE6Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE7Unico.forEach(data => {
        const demoData = competencianivelE7Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele7_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE7Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE8Unico.forEach(data => {
        const demoData = competencianivelE8Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele8_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE8Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE9Unico.forEach(data => {
        const demoData = competencianivelE9Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele9_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE9Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE10Unico.forEach(data => {
        const demoData = competencianivelE10Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele10_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE10Map[data].length).toFixed(0)}%`;
        }
      });
      paisUnico.forEach(data => {
        const demoData = competenciapaisMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`pais_${data}`] = `${(((demoData.total * 100) / demoData.count)/paisMap[data].length).toFixed(0)}%`;
        }
      });
      localidad1Unico.forEach(data => {
        const demoData = competencialocalidad1Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`local1_${data}`] = `${(((demoData.total * 100) / demoData.count)/localidad1Map[data].length).toFixed(0)}%`;
        }
      });
      localidad2Unico.forEach(data => {
        const demoData = competencialocalidad2Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`local2_${data}`] = `${(((demoData.total * 100) / demoData.count)/localidad2Map[data].length).toFixed(0)}%`;
        }
      });
    }
  });

  formatted.forEach(item => {
    if (item.level === 'subdimension') {
      const subDimensionData = subDimensionMap.get(item.id);
      if (subDimensionData && subDimensionData.count > 0 && cantidadRespuestas.value > 3) {
        item.resultado = `${((subDimensionData.totalResult * 100 / subDimensionData.count)/cantidadRespuestas.value).toFixed(0)}%`;
      }

      // Cálculo por demografico submension
      lideresUnico.forEach(data => {
        const lidData = subDimensionlideresMap.get(item.id)[data];
        if (lidData.count > 0) {
          item[`lideres_${data}`] = `${(((lidData.total * 100) / lidData.count)/lideresMap[data].length).toFixed(0) >= 0 ? (
            (((lidData.total * 100) / lidData.count)/lideresMap[data].length).toFixed(0)
          ):(
            0
          )}%`;
        }
      });
      generosUnicos.forEach(genero => {
        const generoData = subDimensionGeneroMap.get(item.id)[genero];
        if (generoData.count > 0) {
          item[`genero_${genero}`] = `${(((generoData.total * 100) / generoData.count)/generoMap[genero].length).toFixed(0)}%`;
        }
      });
      medioTransporteUnico.forEach(data => {
        const demoData = subDimensionmedioTransporteMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`mediotransporte_${data}`] = `${(((demoData.total * 100) / demoData.count)/medioTransporteMap[data].length).toFixed(0)}%`;
        }
      });
      tiempoLlegadaUnico.forEach(data => {
        const demoData = subDimensiontiempoLlegadaMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`tiempollegada_${data}`] = `${(((demoData.total * 100) / demoData.count)/tiempoLlegadaMap[data].length).toFixed(0)}%`;
        }
      });
      cantidadReunionesUnico.forEach(data => {
        const demoData = subDimensioncantidadReunionesMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`reunionesjefe_${data}`] = `${(((demoData.total * 100) / demoData.count)/cantidadReunionesMap[data].length).toFixed(0)}%`;
        }
      });
      oportunidadesMejoraUnico.forEach(data => {
        const demoData = subDimensionoportunidadesMejoraMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`oportunidadesmejora_${data}`] = `${(((demoData.total * 100) / demoData.count)/oportunidadesMejoraMap[data].length).toFixed(0)}%`;
        }
      });
      seguirDesarrollandomeUnico.forEach(data => {
        const demoData = subDimensionseguirDesarrollandomeMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`seguirdesarrollandome_${data}`] = `${(((demoData.total * 100) / demoData.count)/seguirDesarrollandomeMap[data].length).toFixed(0)}%`;
        }
      });
      oportunidadesEmpleoUnico.forEach(data => {
        const demoData = subDimensionoportunidadesEmpleoMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`oportunidadesempleo_${data}`] = `${(((demoData.total * 100) / demoData.count)/oportunidadesEmpleoMap[data].length).toFixed(0)}%`;
        }
      });
      cantidadEmpleosUnico.forEach(data => {
        const demoData = subDimensioncantidadEmpleosMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`cantidadempleos_${data}`] = `${(((demoData.total * 100) / demoData.count)/cantidadEmpleosMap[data].length).toFixed(0)}%`;
        }
      });
      padecimientoSaludUnico.forEach(data => {
        const demoData = subDimensionpadecimientoSaludMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`padecimientosalud_${data}`] = `${(((demoData.total * 100) / demoData.count)/padecimientoSaludMap[data].length).toFixed(0)}%`;
        }
      });
      dependientesEconomicosUnico.forEach(data => {
        const demoData = subDimensiondependientesEconomicosMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`dependienteseconomicos_${data}`] = `${(((demoData.total * 100) / demoData.count)/dependientesEconomicosMap[data].length).toFixed(0)}%`;
        }
      });
      tiempoGenteACargoUnico.forEach(data => {
        const demoData = subDimensiontiempoGenteACargoMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`tiempogente_${data}`] = `${(((demoData.total * 100) / demoData.count)/tiempoGenteACargoMap[data].length).toFixed(0)}%`;
        }
      });
      modalidadTrabajoUnico.forEach(data => {
        const demoData = subDimensionmodalidadTrabajoMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`modalidatrabajo_${data}`] = `${(((demoData.total * 100) / demoData.count)/modalidadTrabajoMap[data].length).toFixed(0)}%`;
        }
      });
      describirOrganizacionUnico.forEach(data => {
        const demoData = subDimensiondescribirOrganizacionMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`describirorganizacion_${data}`] = `${(((demoData.total * 100) / demoData.count)/describirOrganizacionMap[data].length).toFixed(0)}%`;
        }
      });
      areaUnico.forEach(data => {
        const demoData = subDimensionareaMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`areaT_${data}`] = `${(((demoData.total * 100) / demoData.count)/areaMap[data].length).toFixed(0)}%`;
        }
      });
      cargoUnico.forEach(data => {
        const demoData = subDimensioncargoMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`cargoT_${data}`] = `${(((demoData.total * 100) / demoData.count)/cargoMap[data].length).toFixed(0)}%`;
        }
      });
      cargoMologadoUnico.forEach(data => {
        const demoData = subDimensioncargoMologadoMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`cargomologado_${data}`] = `${(((demoData.total * 100) / demoData.count)/cargoMologadoMap[data].length).toFixed(0)}%`;
        }
      });
      educacionUnico.forEach(data => {
        const demoData = subDimensioneducacionMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`educacion_${data}`] = `${(((demoData.total * 100) / demoData.count)/educacionMap[data].length).toFixed(0)}%`;
        }
      });
      generacionUnico.forEach(data => {
        const demoData = subDimensiongeneracionMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`generacion_${data}`] = `${(((demoData.total * 100) / demoData.count)/generacionMap[data].length).toFixed(0)}%`;
        }
      });
      nivelE1Unico.forEach(data => {
        const demoData = subDimensionnivelE1Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele1_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE1Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE2Unico.forEach(data => {
        const demoData = subDimensionnivelE2Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele2_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE2Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE3Unico.forEach(data => {
        const demoData = subDimensionnivelE3Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele3_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE3Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE4Unico.forEach(data => {
        const demoData = subDimensionnivelE4Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele4_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE4Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE5Unico.forEach(data => {
        const demoData = subDimensionnivelE5Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele5_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE5Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE6Unico.forEach(data => {
        const demoData = subDimensionnivelE6Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele6_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE6Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE7Unico.forEach(data => {
        const demoData = subDimensionnivelE7Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele7_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE7Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE8Unico.forEach(data => {
        const demoData = subDimensionnivelE8Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele8_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE8Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE9Unico.forEach(data => {
        const demoData = subDimensionnivelE9Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele9_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE9Map[data].length).toFixed(0)}%`;
        }
      });
      nivelE10Unico.forEach(data => {
        const demoData = subDimensionnivelE10Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele10_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE10Map[data].length).toFixed(0)}%`;
        }
      });
      paisUnico.forEach(data => {
        const demoData = subDimensionpaisMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`pais_${data}`] = `${(((demoData.total * 100) / demoData.count)/paisMap[data].length).toFixed(0)}%`;
        }
      });
      localidad1Unico.forEach(data => {
        const demoData = subDimensionlocalidad1Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`local1_${data}`] = `${(((demoData.total * 100) / demoData.count)/localidad1Map[data].length).toFixed(0)}%`;
        }
      });
      localidad2Unico.forEach(data => {
        const demoData = subDimensionlocalidad2Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`local2_${data}`] = `${(((demoData.total * 100) / demoData.count)/localidad2Map[data].length).toFixed(0)}%`;
        }
      });
    }
  });

  // Cálculo por dimension demograficos
  generosUnicos.forEach(genero => {
    overallGeneroResult.value[genero] = 0;  // Inicializa con 0
  });
  medioTransporteUnico.forEach(data => {
    overallMedioTResult.value[data] = 0;
  });
  tiempoLlegadaUnico.forEach(data => {
    overallTiempoLResult.value[data] = 0;
  });
  cantidadReunionesUnico.forEach(data => {
    overallCantiReuResult.value[data] = 0;
  });
  oportunidadesMejoraUnico.forEach(data => {
    overallOportMejResult.value[data] = 0;
  });
  seguirDesarrollandomeUnico.forEach(data => {
    overallSeguDesResult.value[data] = 0;
  });
  oportunidadesEmpleoUnico.forEach(data => {
    overallOportEmpResult.value[data] = 0;
  });
  cantidadEmpleosUnico.forEach(data => {
    overallCantiEmpResult.value[data] = 0;
  });
  padecimientoSaludUnico.forEach(data => {
    overallPadeSaludResult.value[data] = 0;
  });
  dependientesEconomicosUnico.forEach(data => {
    overallDependEconResult.value[data] = 0;
  });
  tiempoGenteACargoUnico.forEach(data => {
    overallTiempoGenteResult.value[data] = 0;
  });
  modalidadTrabajoUnico.forEach(data => {
    overallModalidadResult.value[data] = 0;
  });
  describirOrganizacionUnico.forEach(data => {
    overallDescOrgResult.value[data] = 0;
  });
  areaUnico.forEach(data => {
    overallAreaResult.value[data] = 0;
  });
  cargoUnico.forEach(data => {
    overallCargoResult.value[data] = 0;
  });
  cargoMologadoUnico.forEach(data => {
    overallCargoMolResult.value[data] = 0;
  });
  educacionUnico.forEach(data => {
    overallEducacionResult.value[data] = 0;
  });
  generacionUnico.forEach(data => {
    overallGenerResult.value[data] = 0;
  });
  nivelE1Unico.forEach(data => {
    overallNivel1Result.value[data] = 0;
  });
  nivelE2Unico.forEach(data => {
    overallNivel2Result.value[data] = 0;
  });
  nivelE3Unico.forEach(data => {
    overallNivel3Result.value[data] = 0;
  });
  nivelE4Unico.forEach(data => {
    overallNivel4Result.value[data] = 0;
  });
  nivelE5Unico.forEach(data => {
    overallNivel5Result.value[data] = 0;
  });
  nivelE6Unico.forEach(data => {
    overallNivel6Result.value[data] = 0;
  });
  nivelE7Unico.forEach(data => {
    overallNivel7Result.value[data] = 0;
  });
  nivelE8Unico.forEach(data => {
    overallNivel8Result.value[data] = 0;
  });
  nivelE9Unico.forEach(data => {
    overallNivel9Result.value[data] = 0;
  });
  nivelE10Unico.forEach(data => {
    overallNivel10Result.value[data] = 0;
  });
  paisUnico.forEach(data => {
    overallPaisResult.value[data] = 0;
  });
  localidad2Unico.forEach(data => {
    overallLocal1Result.value[data] = 0;
  });
  localidad2Unico.forEach(data => {
    overallLocal1Result.value[data] = 0;
  });
  lideresUnico.forEach(data => {
    overallLideresResult.value[data] = 0;
  });
  formatted.forEach(item => {
    if (item.level === 'dimension') {
      const dimensionData = dimensionMap.get(item.id);
      if (dimensionData && dimensionData.count > 0 && cantidadRespuestas.value > 3) {
        item.resultado = `${((dimensionData.totalResult * 100 / dimensionData.count)/cantidadRespuestas.value).toFixed(0)}%`;
        overallResult.value += (dimensionData.totalResult * 100 / dimensionData.count)/cantidadRespuestas.value;
      }

      // Cálculo por dimension demograficos
      lideresUnico.forEach(data => {
        const lidData = dimensionlideresMap.get(item.id)[data];
        if (lidData.count > 0) {
          item[`lideres_${data}`] = `${(((lidData.total * 100) / lidData.count)/lideresMap[data].length) >= 0 ? (
            (((lidData.total * 100) / lidData.count)/lideresMap[data].length).toFixed(0)
          ):(
            0
          )}%`;
          overallLideresResult.value[data] += ((lidData.total * 100) / lidData.count)/lideresMap[data].length;
        }
      });
      generosUnicos.forEach(genero => {
        const generoData = dimensionGeneroMap.get(item.id)[genero];
        if (generoData.count > 0) {
          item[`genero_${genero}`] = `${(((generoData.total * 100) / generoData.count)/generoMap[genero].length).toFixed(0)}%`;
          overallGeneroResult.value[genero] += ((generoData.total * 100) / generoData.count)/generoMap[genero].length;
        }
      });

      // Cálculo por dimension demograficos
      medioTransporteUnico.forEach(data => {
        const demoData = dimensionmedioTransporteMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`mediotransporte_${data}`] = `${(((demoData.total * 100) / demoData.count)/medioTransporteMap[data].length).toFixed(0)}%`;
          overallMedioTResult.value[data] += ((demoData.total * 100) / demoData.count)/medioTransporteMap[data].length;
        }
      });
      tiempoLlegadaUnico.forEach(data => {
        const demoData = dimensiontiempoLlegadaMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`tiempollegada_${data}`] = `${(((demoData.total * 100) / demoData.count)/tiempoLlegadaMap[data].length).toFixed(0)}%`;
          overallTiempoLResult.value[data] += ((demoData.total * 100) / demoData.count)/tiempoLlegadaMap[data].length;
        }
      });
      cantidadReunionesUnico.forEach(data => {
        const demoData = dimensioncantidadReunionesMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`reunionesjefe_${data}`] = `${(((demoData.total * 100) / demoData.count)/cantidadReunionesMap[data].length).toFixed(0)}%`;
          overallCantiReuResult.value[data] += ((demoData.total * 100) / demoData.count)/cantidadReunionesMap[data].length;
        }
      });
      oportunidadesMejoraUnico.forEach(data => {
        const demoData = dimensionoportunidadesMejoraMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`oportunidadesmejora_${data}`] = `${(((demoData.total * 100) / demoData.count)/oportunidadesMejoraMap[data].length).toFixed(0)}%`;
          overallOportMejResult.value[data] += ((demoData.total * 100) / demoData.count)/oportunidadesMejoraMap[data].length;
        }
      });
      seguirDesarrollandomeUnico.forEach(data => {
        const demoData = dimensionseguirDesarrollandomeMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`seguirdesarrollandome_${data}`] = `${(((demoData.total * 100) / demoData.count)/seguirDesarrollandomeMap[data].length).toFixed(0)}%`;
          overallSeguDesResult.value[data] += ((demoData.total * 100) / demoData.count)/seguirDesarrollandomeMap[data].length;
        }
      });
      oportunidadesEmpleoUnico.forEach(data => {
        const demoData = dimensionoportunidadesEmpleoMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`oportunidadesempleo_${data}`] = `${(((demoData.total * 100) / demoData.count)/oportunidadesEmpleoMap[data].length).toFixed(0)}%`;
          overallOportEmpResult.value[data] += ((demoData.total * 100) / demoData.count)/oportunidadesEmpleoMap[data].length;
        }
      });
      cantidadEmpleosUnico.forEach(data => {
        const demoData = dimensioncantidadEmpleosMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`cantidadempleos_${data}`] = `${(((demoData.total * 100) / demoData.count)/cantidadEmpleosMap[data].length).toFixed(0)}%`;
          overallCantiEmpResult.value[data] += ((demoData.total * 100) / demoData.count)/cantidadEmpleosMap[data].length;
        }
      });
      padecimientoSaludUnico.forEach(data => {
        const demoData = dimensionpadecimientoSaludMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`padecimientosalud_${data}`] = `${(((demoData.total * 100) / demoData.count)/padecimientoSaludMap[data].length).toFixed(0)}%`;
          overallPadeSaludResult.value[data] += ((demoData.total * 100) / demoData.count)/padecimientoSaludMap[data].length;
        }
      });
      dependientesEconomicosUnico.forEach(data => {
        const demoData = dimensiondependientesEconomicosMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`dependienteseconomicos_${data}`] = `${(((demoData.total * 100) / demoData.count)/dependientesEconomicosMap[data].length).toFixed(0)}%`;
          overallDependEconResult.value[data] += ((demoData.total * 100) / demoData.count)/dependientesEconomicosMap[data].length;
        }
      });
      tiempoGenteACargoUnico.forEach(data => {
        const demoData = dimensiontiempoGenteACargoMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`tiempogente_${data}`] = `${(((demoData.total * 100) / demoData.count)/tiempoGenteACargoMap[data].length).toFixed(0)}%`;
          overallTiempoGenteResult.value[data] += ((demoData.total * 100) / demoData.count)/tiempoGenteACargoMap[data].length;
        }
      });
      modalidadTrabajoUnico.forEach(data => {
        const demoData = dimensionmodalidadTrabajoMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`modalidatrabajo_${data}`] = `${(((demoData.total * 100) / demoData.count)/modalidadTrabajoMap[data].length).toFixed(0)}%`;
          overallModalidadResult.value[data] += ((demoData.total * 100) / demoData.count)/modalidadTrabajoMap[data].length;
        }
      });
      describirOrganizacionUnico.forEach(data => {
        const demoData = dimensiondescribirOrganizacionMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`describirorganizacion_${data}`] = `${(((demoData.total * 100) / demoData.count)/describirOrganizacionMap[data].length).toFixed(0)}%`;
          overallDescOrgResult.value[data] += ((demoData.total * 100) / demoData.count)/describirOrganizacionMap[data].length;
        }
      });
      areaUnico.forEach(data => {
        const demoData = dimensionareaMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`areaT_${data}`] = `${(((demoData.total * 100) / demoData.count)/areaMap[data].length).toFixed(0)}%`;
          overallAreaResult.value[data] += ((demoData.total * 100) / demoData.count)/areaMap[data].length;
        }
      });
      cargoUnico.forEach(data => {
        const demoData = dimensioncargoMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`cargoT_${data}`] = `${(((demoData.total * 100) / demoData.count)/cargoMap[data].length).toFixed(0)}%`;
          overallCargoResult.value[data] += ((demoData.total * 100) / demoData.count)/cargoMap[data].length;
        }
      });
      cargoMologadoUnico.forEach(data => {
        const demoData = dimensioncargoMologadoMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`cargomologado_${data}`] = `${(((demoData.total * 100) / demoData.count)/cargoMologadoMap[data].length).toFixed(0)}%`;
          overallCargoMolResult.value[data] += ((demoData.total * 100) / demoData.count)/cargoMologadoMap[data].length;
        }
      });
      educacionUnico.forEach(data => {
        const demoData = dimensioneducacionMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`educacion_${data}`] = `${(((demoData.total * 100) / demoData.count)/educacionMap[data].length).toFixed(0)}%`;
          overallEducacionResult.value[data] += ((demoData.total * 100) / demoData.count)/educacionMap[data].length;
        }
      });
      generacionUnico.forEach(data => {
        const demoData = dimensiongeneracionMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`generacion_${data}`] = `${(((demoData.total * 100) / demoData.count)/generacionMap[data].length).toFixed(0)}%`;
          overallGenerResult.value[data] += ((demoData.total * 100) / demoData.count)/generacionMap[data].length;
        }
      });
      nivelE1Unico.forEach(data => {
        const demoData = dimensionnivelE1Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele1_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE1Map[data].length).toFixed(0)}%`;
          overallNivel1Result.value[data] += ((demoData.total * 100) / demoData.count)/nivelE1Map[data].length;
        }
      });
      nivelE2Unico.forEach(data => {
        const demoData = dimensionnivelE2Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele2_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE2Map[data].length).toFixed(0)}%`;
          overallNivel2Result.value[data] += ((demoData.total * 100) / demoData.count)/nivelE2Map[data].length;
        }
      });
      nivelE3Unico.forEach(data => {
        const demoData = dimensionnivelE3Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele3_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE3Map[data].length).toFixed(0)}%`;
          overallNivel3Result.value[data] += ((demoData.total * 100) / demoData.count)/nivelE3Map[data].length;
        }
      });
      nivelE4Unico.forEach(data => {
        const demoData = dimensionnivelE4Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele4_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE4Map[data].length).toFixed(0)}%`;
          overallNivel4Result.value[data] += ((demoData.total * 100) / demoData.count)/nivelE4Map[data].length;
        }
      });
      nivelE5Unico.forEach(data => {
        const demoData = dimensionnivelE5Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele5_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE5Map[data].length).toFixed(0)}%`;
          overallNivel5Result.value[data] += ((demoData.total * 100) / demoData.count)/nivelE5Map[data].length;
        }
      });
      nivelE6Unico.forEach(data => {
        const demoData = dimensionnivelE6Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele6_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE6Map[data].length).toFixed(0)}%`;
          overallNivel6Result.value[data] += ((demoData.total * 100) / demoData.count)/nivelE6Map[data].length;
        }
      });
      nivelE7Unico.forEach(data => {
        const demoData = dimensionnivelE7Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele7_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE7Map[data].length).toFixed(0)}%`;
          overallNivel7Result.value[data] += ((demoData.total * 100) / demoData.count)/nivelE7Map[data].length;
        }
      });
      nivelE8Unico.forEach(data => {
        const demoData = dimensionnivelE8Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele8_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE8Map[data].length).toFixed(0)}%`;
          overallNivel8Result.value[data] += ((demoData.total * 100) / demoData.count)/nivelE8Map[data].length;
        }
      });
      nivelE9Unico.forEach(data => {
        const demoData = dimensionnivelE9Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele9_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE9Map[data].length).toFixed(0)}%`;
          overallNivel9Result.value[data] += ((demoData.total * 100) / demoData.count)/nivelE9Map[data].length;
        }
      });
      nivelE10Unico.forEach(data => {
        const demoData = dimensionnivelE10Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`nivele10_${data}`] = `${(((demoData.total * 100) / demoData.count)/nivelE10Map[data].length).toFixed(0)}%`;
          overallNivel10Result.value[data] += ((demoData.total * 100) / demoData.count)/nivelE10Map[data].length;
        }
      });
      paisUnico.forEach(data => {
        const demoData = dimensionpaisMap.get(item.id)[data];
        if (demoData.count > 0) {
          item[`pais_${data}`] = `${(((demoData.total * 100) / demoData.count)/paisMap[data].length).toFixed(0)}%`;
          overallPaisResult.value[data] += ((demoData.total * 100) / demoData.count)/paisMap[data].length;
        }
      });
      localidad1Unico.forEach(data => {
        const demoData = dimensionlocalidad1Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`local1_${data}`] = `${(((demoData.total * 100) / demoData.count)/localidad1Map[data].length).toFixed(0)}%`;
          overallLocal1Result.value[data] += ((demoData.total * 100) / demoData.count)/localidad1Map[data].length;
        }
      });
      localidad2Unico.forEach(data => {
        const demoData = dimensionlocalidad2Map.get(item.id)[data];
        if (demoData.count > 0) {
          item[`local2_${data}`] = `${(((demoData.total * 100) / demoData.count)/localidad2Map[data].length).toFixed(0)}%`;
          overallLocal2Result.value[data] += ((demoData.total * 100) / demoData.count)/localidad2Map[data].length;
        }
      });
    }
  });
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
  const updatedData:any = [];
  const addedParents = new Set();

  tableData.value.forEach(item => {
    // Solo agregar el item si su padre está expandido o si es una dimensión
    if (item.level === 'dimension' || expandedRows.value.has(item.parent)) {
      updatedData.push(item);
      if (item.level !== 'afirmacion' && expandedRows.value.has(item.id)) {
        addedParents.add(item.id);
      }
    }
  });
  formattedData.value = updatedData;
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
    const row = {
      Modelo: item.level.toUpperCase(),
      Name: item.name,
      Resultado: item.resultado,
    };

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
    if (props.filterData.valores && Array.isArray(props.filterData.valores)) {
      props.filterData.valores.map((val, index) => {
        row[index] = item[`val${index + 1}`] || '';
      });
    }
    if (props.filterData.columns.map(nc => nc.name).includes('Lideres')) {
      lideresUnico.forEach(mt => {
        row[mt] = item[`lideres_${mt}`] || '';
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


  props.filterData.rows = [
    { id: 32, name: 'Dimensiones', category: 'modelo' },
    { id: 33, name: 'Subdimensiones', category: 'modelo' },
    { id: 34, name: 'Competencias', category: 'modelo' },
    { id: 35, name: 'Afirmaciones', category: 'modelo' },];
  props.filterData.columns = [{ id: 41, name: 'Lideres', category: 'lidPreg' },];
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
