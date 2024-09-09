<template>
  <div class="tabla_container">
    <v-data-table-virtual
      :headers="headers"
      height="550"
      :items="formattedData"
    >
      <template v-slot:item="{ item }">
        <tr>
            <!-- Columnas estáticas -->
            <td v-for="header in headers" :key="header.key">
              <span>{{ item[header.key] || '-' }}</span> 
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
const route = useRoute();
const empresa = ref<number>(0);
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

// Función para obtener los datos de la empresa por ID
const empresafounded = async (id: number) => {
  if (id) {
    const data = await empresasService.getEmpresaId(id);
    empresaData.value = data;
  }
};

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

    pregAbUnico = [...new Set(dataDimensions.filter((rd:any) => rd.dimid === 5).map((mt:any) => mt.indxldesc))];
    pregAbUnico.forEach((psu, index) => {
      pregAbMap[psu] = pregAbiertas.value.filter((ps: any) => ps.bid.bdinfidindn === (index+1));
    });

    tableData.value = transformData(
      pregAbMap, pregAbUnico,
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
    );

    updateFormattedData();
  }
};

const headers = ref([
  { title: 'Modelo', sortable: false, key: 'modelo' },
]);

watch(() => props.filterData.columns, (newColumns) => {
  if (newColumns) {
    let dynamicHeaders = [];
    if (newColumns.map(nc => nc.name).includes('Preguntas Abiertas')) {
      pregAbUnico.forEach((pa, index) => {
          dynamicHeaders.push({
              title: pa,
              sortable: false,
              key: `preguntasab_${pa}`,
          });
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
      { title: 'Modelo', sortable: false, key: 'modelo' },
      ...dynamicHeaders,
    ];
  }
}, { immediate: true });


const applyFilter = () => {
  formattedData.value = [];
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
    if (props.filterData.rows.some(nc => nc.name === 'Medio de transporte')) {
      formattedData.value.push({
        modelo: 'Medio de transporte',
        expandable: false,
        isCategoryTitle: true
      });
      medioTransporteUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Tiempo de llegada')) {
      formattedData.value.push({
        modelo: 'Tiempo de llegada',
        expandable: false,
        isCategoryTitle: true
      });
      tiempoLlegadaUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Reuniones con tu jefe')) {
      formattedData.value.push({
        modelo: 'Reuniones con tu jefe',
        expandable: false,
        isCategoryTitle: true
      });
      cantidadReunionesUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Oportunidades')) {
      formattedData.value.push({
        modelo: 'Oportunidades de Mejora',
        expandable: false,
        isCategoryTitle: true
      });
      oportunidadesMejoraUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Seguir desarrollandome')) {
      formattedData.value.push({
        modelo: 'Seguir desarrollandome',
        expandable: false,
        isCategoryTitle: true
      });
      seguirDesarrollandomeUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Buscar oportunidades de empleo')) {
      formattedData.value.push({
        modelo: 'Oportunidades de empleo',
        expandable: false,
        isCategoryTitle: true
      });
      oportunidadesEmpleoUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Cantidad de empleos')) {
      formattedData.value.push({
        modelo: 'Cantidad de empleos',
        expandable: false,
        isCategoryTitle: true
      });
      cantidadEmpleosUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Padecimiento de salud crónico')) {
      formattedData.value.push({
        modelo: 'Padecimiento de salud crónico',
        expandable: false,
        isCategoryTitle: true
      });
      padecimientoSaludUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Dependientes económicos')) {
      formattedData.value.push({
        modelo: 'Dependientes económicos',
        expandable: false,
        isCategoryTitle: true
      });
      dependientesEconomicosUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Tiempo de gente a cargo')) {
      formattedData.value.push({
        modelo: 'Tiempo de gente a cargo',
        expandable: false,
        isCategoryTitle: true
      });
      tiempoGenteACargoUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Modalidad de trabajo')) {
      formattedData.value.push({
        modelo: 'Modalidad de trabajo',
        expandable: false,
        isCategoryTitle: true
      });
      modalidadTrabajoUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Describir tu organización')) {
      formattedData.value.push({
        modelo: 'Describir tu organización',
        expandable: false,
        isCategoryTitle: true
      });
      describirOrganizacionUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Area')) {
      formattedData.value.push({
        modelo: 'Area',
        expandable: false,
        isCategoryTitle: true
      });
      areaUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Cargo')) {
      formattedData.value.push({
        modelo: 'Cargo',
        expandable: false,
        isCategoryTitle: true
      });
      cargoUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Cargo mologado')) {
      formattedData.value.push({
        modelo: 'Cargo mologado',
        expandable: false,
        isCategoryTitle: true
      });
      cargoMologadoUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Educación')) {
      formattedData.value.push({
        modelo: 'Educación',
        expandable: false,
        isCategoryTitle: true
      });
      educacionUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Generación')) {
      formattedData.value.push({
        modelo: 'Generación',
        expandable: false,
        isCategoryTitle: true
      });
      generacionUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Localidad 1')) {
      formattedData.value.push({
        modelo: 'Localidad 1',
        expandable: false,
        isCategoryTitle: true
      });
      localidad1Unico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Localidad 2')) {
      formattedData.value.push({
        modelo: 'Localidad 2',
        expandable: false,
        isCategoryTitle: true
      });
      localidad2Unico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Nivel estructural 1')) {
      formattedData.value.push({
        modelo: 'Nivel estructural 1',
        expandable: false,
        isCategoryTitle: true
      });
      nivelE1Unico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Nivel estructural 2')) {
      formattedData.value.push({
        modelo: 'Nivel estructural 2',
        expandable: false,
        isCategoryTitle: true
      });
      nivelE2Unico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Nivel estructural 3')) {
      formattedData.value.push({
        modelo: 'Nivel estructural 3',
        expandable: false,
        isCategoryTitle: true
      });
      nivelE3Unico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Nivel estructural 4')) {
      formattedData.value.push({
        modelo: 'Nivel estructural 4',
        expandable: false,
        isCategoryTitle: true
      });
      nivelE4Unico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Nivel estructural 5')) {
      formattedData.value.push({
        modelo: 'Nivel estructural 5',
        expandable: false,
        isCategoryTitle: true
      });
      nivelE5Unico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Nivel estructural 6')) {
      formattedData.value.push({
        modelo: 'Nivel estructural 6',
        expandable: false,
        isCategoryTitle: true
      });
      nivelE6Unico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Nivel estructural 7')) {
      formattedData.value.push({
        modelo: 'Nivel estructural 7',
        expandable: false,
        isCategoryTitle: true
      });
      nivelE7Unico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Nivel estructural 8')) {
      formattedData.value.push({
        modelo: 'Nivel estructural 8',
        expandable: false,
        isCategoryTitle: true
      });
      nivelE8Unico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Nivel estructural 9')) {
      formattedData.value.push({
        modelo: 'Nivel estructural 9',
        expandable: false,
        isCategoryTitle: true
      });
      nivelE9Unico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Nivel estructural 10')) {
      formattedData.value.push({
        modelo: 'Nivel estructural 10',
        expandable: false,
        isCategoryTitle: true
      });
      nivelE10Unico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
    if (props.filterData.rows.some(nc => nc.name === 'Pais')) {
      formattedData.value.push({
        modelo: 'Pais',
        expandable: false,
        isCategoryTitle: true
      });
      paisUnico.forEach(data => {
        // Filtra los datos de tableData para el género actual
        const filteredItems = tableData.value
          .filter(item => item.modelo === data);

        // Agrega los datos filtrados a formattedData
        formattedData.value.push(...filteredItems);
      });
    }
  } else {
    console.error("filterData o filterData.rows no está definido o no es un array.");
  }
};



watch(() => props.filterData, () => {
  applyFilter(); // Actualiza los datos filtrados cuando cambie filterData
}, { deep: true });

watch(() => tableData.value, () => {
  applyFilter(); // Actualiza los datos filtrados cuando cambie tableData
}, { deep: true });

// Función para transformar datos planos a la estructura jerárquica
const transformData = (
      pregAbMap: { [key: string]: any[] }, pregAbUnico: string[],
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
  ): any[] => {
  const formatted: any[] = [];
  const addedItems = new Set();

  // Iterar sobre cada valor único
  generosUnicos.forEach(genero => {
    const data = generoMap[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };

    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  // Iterar sobre cada valor único
  medioTransporteUnico.forEach(dataFila => {
    const data = medioTransporteMap[dataFila] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: dataFila };

    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  // Iterar sobre cada valor único
  tiempoLlegadaUnico.forEach(dataFila => {
    const data = tiempoLlegadaMap[dataFila] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: dataFila };

    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  // Iterar sobre cada valor único
  cantidadReunionesUnico.forEach(dataFila => {
    const data = cantidadReunionesMap[dataFila] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: dataFila };

    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  // Iterar sobre cada valor único
  oportunidadesMejoraUnico.forEach(genero => {
    const data = oportunidadesMejoraMap[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };

    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });

  seguirDesarrollandomeUnico.forEach(genero => {
    const data = seguirDesarrollandomeMap[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });

  oportunidadesEmpleoUnico.forEach(genero => {
    const data = oportunidadesEmpleoMap[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };

    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });

  // Iterar sobre cada valor único
  cantidadEmpleosUnico.forEach(genero => {
    const data = cantidadEmpleosMap[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };

    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });

  padecimientoSaludUnico.forEach(genero => {
    const data = padecimientoSaludMap[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });

  dependientesEconomicosUnico.forEach(genero => {
    const data = dependientesEconomicosMap[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };

    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });

  tiempoGenteACargoUnico.forEach(genero => {
    const data = tiempoGenteACargoMap[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });

  modalidadTrabajoUnico.forEach(genero => {
    const data = modalidadTrabajoMap[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };

    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });

  describirOrganizacionUnico.forEach(genero => {
    const data = describirOrganizacionMap[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });

  areaUnico.forEach(genero => {
    const data = areaMap[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });

  cargoUnico.forEach(genero => {
    const data = cargoMap[genero] || [];
    const ids = data.map(item => item.bdbdo10id.bdid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  
  cargoMologadoUnico.forEach(genero => {
    const data = cargoMologadoMap[genero] || [];
    const ids = data.map(item => item.bdbdo10id.bdid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });

  educacionUnico.forEach(genero => {
    const data = educacionMap[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });

  generacionUnico.forEach(genero => {
    const data = generacionMap[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });


  nivelE1Unico.forEach(genero => {
    const data = nivelE1Map[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  nivelE2Unico.forEach(genero => {
    const data = nivelE2Map[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  nivelE3Unico.forEach(genero => {
    const data = nivelE3Map[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  nivelE4Unico.forEach(genero => {
    const data = nivelE4Map[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  nivelE5Unico.forEach(genero => {
    const data = nivelE5Map[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  nivelE6Unico.forEach(genero => {
    const data = nivelE6Map[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  nivelE7Unico.forEach(genero => {
    const data = nivelE7Map[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  nivelE8Unico.forEach(genero => {
    const data = nivelE8Map[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  nivelE9Unico.forEach(genero => {
    const data = nivelE9Map[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  nivelE10Unico.forEach(genero => {
    const data = nivelE10Map[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });

  paisUnico.forEach(genero => {
    const data = paisMap[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });

  localidad1Unico.forEach(genero => {
    const data = localidad1Map[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad2Unico.forEach(dataCol => {
      const medioData = localidad2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  localidad2Unico.forEach(genero => {
    const data = localidad2Map[genero] || [];
    const ids = data.map(item => item.bid.bdinfid);

    // Crear una fila
    const row = { modelo: genero };
    generosUnicos.forEach(dataCol => {
      const medioData = generoMap[dataCol] || [];
      const filteredByGenero = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`genero_${dataCol}`] = `${((filteredByGenero.length*100)/data.length).toFixed(0)}%`;
    });
    medioTransporteUnico.forEach(medioTransporte => {
      const medioData = medioTransporteMap[medioTransporte] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`mediotransporte_${medioTransporte}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoLlegadaUnico.forEach(dataCol => {
      const medioData = tiempoLlegadaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempollegada_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadReunionesUnico.forEach(dataCol => {
      const medioData = cantidadReunionesMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`reunionesjefe_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesMejoraUnico.forEach(dataCol => {
      const medioData = oportunidadesMejoraMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesmejora_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    seguirDesarrollandomeUnico.forEach(dataCol => {
      const medioData = seguirDesarrollandomeMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`seguirdesarrollandome_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    oportunidadesEmpleoUnico.forEach(dataCol => {
      const medioData = oportunidadesEmpleoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`oportunidadesempleo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cantidadEmpleosUnico.forEach(dataCol => {
      const medioData = cantidadEmpleosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`cantidadempleos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    padecimientoSaludUnico.forEach(dataCol => {
      const medioData = padecimientoSaludMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`padecimientosalud_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    dependientesEconomicosUnico.forEach(dataCol => {
      const medioData = dependientesEconomicosMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`dependienteseconomicos_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    tiempoGenteACargoUnico.forEach(dataCol => {
      const medioData = tiempoGenteACargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`tiempogente_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    modalidadTrabajoUnico.forEach(dataCol => {
      const medioData = modalidadTrabajoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`modalidatrabajo_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    describirOrganizacionUnico.forEach(dataCol => {
      const medioData = describirOrganizacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`describirorganizacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    areaUnico.forEach(dataCol => {
      const medioData = areaMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`areaT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoUnico.forEach(dataCol => {
      const medioData = cargoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargoT_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    cargoMologadoUnico.forEach(dataCol => {
      const medioData = cargoMologadoMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bdbdo10id.bdid));
      row[`cargomologado_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    educacionUnico.forEach(dataCol => {
      const medioData = educacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`educacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    generacionUnico.forEach(dataCol => {
      const medioData = generacionMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`generacion_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE1Unico.forEach(dataCol => {
      const medioData = nivelE1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE2Unico.forEach(dataCol => {
      const medioData = nivelE2Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele2_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE3Unico.forEach(dataCol => {
      const medioData = nivelE3Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele3_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE4Unico.forEach(dataCol => {
      const medioData = nivelE4Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele4_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE5Unico.forEach(dataCol => {
      const medioData = nivelE5Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele5_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE6Unico.forEach(dataCol => {
      const medioData = nivelE6Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele6_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE7Unico.forEach(dataCol => {
      const medioData = nivelE7Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele7_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE8Unico.forEach(dataCol => {
      const medioData = nivelE8Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele8_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE9Unico.forEach(dataCol => {
      const medioData = nivelE9Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele9_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    nivelE10Unico.forEach(dataCol => {
      const medioData = nivelE10Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`nivele10_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    paisUnico.forEach(dataCol => {
      const medioData = paisMap[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`pais_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });
    localidad1Unico.forEach(dataCol => {
      const medioData = localidad1Map[dataCol] || [];
      const filtered = medioData.filter(item => ids.includes(item.bid.bdinfid));
      row[`local1_${dataCol}`] = `${((filtered.length*100)/data.length).toFixed(0)}%`;
    });

    formatted.push(row);
  });
  /* '''''''++++++++++++++' */
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
    const row = {
      Modelo: item.modelo,
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
    if (props.filterData.columns.map(nc => nc.name).includes('Preguntas Abiertas')) {
      pregAbUnico.forEach((pregunta) => {
        row[pregunta] = item[`preguntasab_${pregunta}`] || '';
      });
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
  const empresaId = route.query.empresa ? Number(route.query.empresa) : null;
  empresa.value = isNaN(empresaId) ? null : empresaId;
  await empresafounded(empresa.value);
  await answersFounded(empresa.value);

});

</script>

<style scoped>
.tabla_container {
  padding: 0 30px
}
</style>
