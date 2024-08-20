<template>
  <div class="tabla_container">
    <caption>{{ empresaData.empnombre }}</caption>
    <v-btn @click="exportToExcel" color="primary" class="mb-4">Exportar a Excel</v-btn>
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
            <span>
              {{ item.name }}
            </span>
            <!-- Columna para Resultado -->
          </td>
          <td v-if="item.level === 'afirmacion' && selectedLevels.includes('afirmacion')">
            {{ item.result }}
          </td>
          <td v-if="item.level === 'afirmacion' && selectedLevels.includes('afirmacion')">
            {{ item.val1 }}
          </td>
          <td v-if="item.level === 'afirmacion' && selectedLevels.includes('afirmacion')">
            {{ item.val2 }}
          </td>
          <td v-if="item.level === 'afirmacion' && selectedLevels.includes('afirmacion')">
            {{ item.val3 }}
          </td>
          <td v-if="item.level === 'dimension' && selectedLevels.includes('dimension')">
            {{ item.result }}
          </td>
          <td v-if="item.level === 'dimension' && selectedLevels.includes('dimension')">
            {{ item.val1 }}
          </td>
          <td v-if="item.level === 'dimension' && selectedLevels.includes('dimension')">
            {{ item.val2 }}
          </td>
          <td v-if="item.level === 'dimension' && selectedLevels.includes('dimension')">
            {{ item.val3 }}
          </td>
          <td v-if="item.level === 'subdimension' && selectedLevels.includes('subdimension')">
            {{ item.result }}
          </td>
          <td v-if="item.level === 'subdimension' && selectedLevels.includes('subdimension')">
            {{ item.val1 }}
          </td>
          <td v-if="item.level === 'subdimension' && selectedLevels.includes('subdimension')">
            {{ item.val2 }}
          </td>
          <td v-if="item.level === 'subdimension' && selectedLevels.includes('subdimension')">
            {{ item.val3 }}
          </td>
          <td v-if="item.level === 'competencia' && selectedLevels.includes('competencia')">
            {{ item.result }}
          </td>
          <td v-if="item.level === 'competencia' && selectedLevels.includes('competencia')">
            {{ item.val1 }}
          </td>
          <td v-if="item.level === 'competencia' && selectedLevels.includes('competencia')">
            {{ item.val2 }}
          </td>
          <td v-if="item.level === 'competencia' && selectedLevels.includes('competencia')">
            {{ item.val3 }}
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
const desviacionEstandar =  ref<number>(0);
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
const medioTransporte:any = ref({});
const tiempoLlegada:any = ref({});
const cantidadReuniones:any = ref({});
const oportunidadesMejora:any = ref({});
const seguirDesarrollandome:any = ref({});
const oportunidadesEmpleo:any = ref({});
const cantidadEmpleos:any = ref({});
const padecimientoSalud:any = ref({});
const dependientesEconomicos:any = ref({});
const tiempoGenteACargo:any = ref({});
const modalidadTrabajo:any = ref({});
const describirOrganizacion:any = ref({});
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
const tipoTrabajo:any = ref({});


let generosUnicos = [];
let medioTransporteUnico = [];
let tiempoLlegadaUnico = [];
let cantidadReunionesUnico = [];
let oportunidadesMejoraUnico = [];
let seguirDesarrollandomeUnico = [];
let oportunidadesEmpleoUnico = [];
let cantidadEmpleosUnico = [];
let padecimientoSaludUnico = [];
let dependientesEconomicosUnico = [];
let tiempoGenteACargoUnico = [];
let modalidadTrabajoUnico = [];
let describirOrganizacionUnico = [];
let añosTrabajoUnico = [];
let areaUnico = [];
let cargoUnico = [];
let cargoMologadoUnico = [];
let educacionUnico = [];
let generacionUnico = [];

const headers = ref([
  { title: 'Modelo', sortable: false, key: 'dimension' },
  { title: 'Resultado (%)', sortable: false, key: 'result' },
  { title: 'Valor1', sortable: false, key: 'val1' },
  { title: 'Valor2', sortable: false, key: 'val2' },
  { title: 'Valor3', sortable: false, key: 'val3' },
]);

watch(() => props.filterData.columns, (newColumns) => {
  if (newColumns && newColumns.length >= 3) {
    headers.value = [
      { title: 'Modelo', sortable: false, key: 'dimension' },
      { title: 'Resultado (%)', sortable: false, key: 'result' },
      { title: newColumns[0] || 'Valor1', sortable: false, key: 'val1' },
      { title: newColumns[1] || 'Valor2', sortable: false, key: 'val2' },
      { title: newColumns[2] || 'Valor3', sortable: false, key: 'val3' },
    ];
  }
}, { immediate: true });

// Filtrar los datos según la selección
const applyFilter = () => {
  //console.log("Aplicando filtro con datos:", props.filterData);
  formattedData.value = [];

  // Limpiar los niveles seleccionados
  selectedLevels.value = [];

  if (props.filterData.rows.includes('Dimensiones')) {
    formattedData.value = tableData.value
      .filter(item => item.level === 'dimension')
      .map(item => ({ ...item, expandable: false }));
    selectedLevels.value.push('dimension');
  }

  if (props.filterData.rows.includes('Subdimensiones')) {
    formattedData.value = tableData.value
      .filter(item => item.level === 'dimension' || item.level === 'subdimension')
      .map(item => ({ 
        ...item, 
        expandable: item.level === 'dimension' 
      }));
    selectedLevels.value.push('subdimension');
  }

  if (props.filterData.rows.includes('Competencias')) {
    formattedData.value = tableData.value
      .filter(item => item.level === 'dimension' || item.level === 'subdimension' || item.level === 'competencia')
      .map(item => ({ 
        ...item, 
        expandable: item.level === 'dimension' || item.level === 'subdimension' 
      }));
    selectedLevels.value.push('competencia');
  }

  if (props.filterData.rows.includes('Afirmaciones')) {
    formattedData.value = tableData.value
      .filter(item => item.level === 'dimension' || item.level === 'subdimension' || item.level === 'competencia' || item.level === 'afirmacion')
      .map(item => ({ 
        ...item, 
        expandable: item.level === 'dimension' || item.level === 'subdimension' || item.level === 'competencia' 
      }));
    selectedLevels.value.push('afirmacion');
  }
};


// Observa los cambios en filterData para aplicar el filtro automáticamente
watch(() => props.filterData, applyFilter, { deep: true });


// Función para transformar datos planos a la estructura jerárquica
const transformData = (data: any[]): any[] => {
  const formatted: any[] = [];
  const addedItems = new Set();
  const dimensionMap = new Map();
  const subDimensionMap = new Map();
  const competenciaMap = new Map();

  data.forEach(item => {
    const [empId, dimId, dimDesc, subDimId, subDimDesc, competencia, afirId, afirDesc, indValPon, resultValue, Benchmark] = item;

    // Handle Dimensions
    if (!addedItems.has(dimId)) {
      formatted.push({
        name: dimDesc,
        level: 'dimension',
        id: dimId,
        expandable: true,
        result: 0, // Placeholder
        val1: '0',
        val2: '0',
        val3: '0',
        count: 0
      });
      addedItems.add(dimId);
      dimensionMap.set(dimId, { totalResult: 0, count: 0 });
    }

    // Handle Subdimensions
    if (!addedItems.has(`${dimId}-${subDimId}`)) {
      formatted.push({
        name: subDimDesc.trim(),
        level: 'subdimension',
        id: `${dimId}-${subDimId}`,
        parent: dimId,
        expandable: true,
        result: 0, // Placeholder
        val1: '0',
        val2: '0',
        val3: '0',
        count: 0
      });
      addedItems.add(`${dimId}-${subDimId}`);
      subDimensionMap.set(`${dimId}-${subDimId}`, { totalResult: 0, count: 0 });
    }

    // Handle Competencias
    if (!addedItems.has(`${subDimId}-${competencia}`)) {
      formatted.push({
        name: competencia,
        level: 'competencia',
        id: `${subDimId}-${competencia}`,
        parent: `${dimId}-${subDimId}`,
        expandable: true,
        result: 0, // Placeholder
        val1: '0',
        val2: '0',
        val3: '0',
        count: 0
      });
      addedItems.add(`${subDimId}-${competencia}`);
      competenciaMap.set(`${subDimId}-${competencia}`, { totalResult: 0, count: 0 });
    }

    // Handle Afirmaciones
    const afirmacion = {
      name: afirDesc.trim(),
      level: 'afirmacion',
      id: `${subDimId}-${competencia}-${afirId}`,
      parent: `${subDimId}-${competencia}`,
      result: `${(resultValue * 100).toFixed(2)}%`,
      val1: '0',
      val2: '0',
      val3: '0',
      expandable: false
    };
    formatted.push(afirmacion);

    // Update Maps for Afirmaciones
    const competenciaKey = `${subDimId}-${competencia}`;
    const subDimKey = `${dimId}-${subDimId}`;

    if (competenciaMap.has(competenciaKey)) {
      const competenciaData = competenciaMap.get(competenciaKey);
      competenciaData.totalResult += resultValue;
      competenciaData.count += 1;
      competenciaMap.set(competenciaKey, competenciaData);
    }

    if (subDimensionMap.has(subDimKey)) {
      const subDimensionData = subDimensionMap.get(subDimKey);
      subDimensionData.totalResult += resultValue;
      subDimensionData.count += 1;
      subDimensionMap.set(subDimKey, subDimensionData);
    }

    if (dimensionMap.has(dimId)) {
      const dimensionData = dimensionMap.get(dimId);
      dimensionData.totalResult += resultValue;
      dimensionData.count += 1;
      dimensionMap.set(dimId, dimensionData);
    }
  });

  // Calculate and set average results for Competencias
  formatted.forEach(item => {
    if (item.level === 'competencia') {
      const competenciaData = competenciaMap.get(item.id);
      if (competenciaData && competenciaData.count > 0) {
        item.result = `${(competenciaData.totalResult / competenciaData.count * 100).toFixed(2)}%`;
      }
    }
  });

  // Calculate and set average results for Subdimensiones
  formatted.forEach(item => {
    if (item.level === 'subdimension') {
      const subDimensionData = subDimensionMap.get(item.id);
      if (subDimensionData && subDimensionData.count > 0) {
        item.result = `${(subDimensionData.totalResult / subDimensionData.count * 100).toFixed(2)}%`;
      }
    }
  });

  // Calculate and set average results for Dimensiones
  formatted.forEach(item => {
    if (item.level === 'dimension') {
      const dimensionData = dimensionMap.get(item.id);
      if (dimensionData && dimensionData.count > 0) {
        item.result = `${(dimensionData.totalResult / dimensionData.count * 100).toFixed(2)}%`;
      }
    }
  });

  return formatted;
};


// Función para obtener los datos de la empresa por ID
const empresafounded = async (id: number) => {
  if (id) {
    const data = await empresasService.getEmpresaId(id);
    empresaData.value = data;
  }
};

// Función para obtener las dimensiones por ID de empresa
const dimensionsFounded = async (id: number) => {
  if (id) {
    const data = await dimensionesService.getDimensionsByEmp(id);
    //console.log(data);
    tableData.value = transformData(data);
    updateFormattedData();
  }
};
// Función para obtener las respuestas por ID de empresa y los demográficos
const answersFounded = async (id: number) => {
  if (id) {
    const data = await respuestasService.getAnswersID(id);
    const bdbd010Demo = await bdbd010Service.getBdbd010ByEmp(id);
    const desvEstData = await condensadoDimensionesService.getCondensadoDimensionsByEmp(id);

    bdbd010Data.value = bdbd010Demo;
    //console.log(data);
    respuestasData.value = data

    //cantidad de respuestas
    cantidadRespuestas.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 1).length;

    /* DEMOGRÁFICOS */
    generos.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 1);
    medioTransporte.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 2);
    tiempoLlegada.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 3);
    cantidadReuniones.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 4);
    oportunidadesMejora.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 5);
    seguirDesarrollandome.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 6);
    oportunidadesEmpleo.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 7);
    cantidadEmpleos.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 8);
    padecimientoSalud.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 9);
    dependientesEconomicos.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 10);
    tiempoGenteACargo.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 11);
    modalidadTrabajo.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 12);
    describirOrganizacion.value = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 13);
    // VARIABLE PARA LOS AÑOS DE TRABAJO
    const dataRespuestas = respuestasData.value.filter((rd:any) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 1)
    añosTrabajo.value = dataRespuestas.map((dr: any) => calculateYears(dr.bdinfantiguedad));

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
    tipoTrabajo.value = dataRespuestas.map((dr:any) => dr.bdinfcondcion);

    //DESVIACION ESTANDAR
    desviacionEstandar.value = desvEstData[0].statement_standarddeviation;
    benchmark1.value = desvEstData[0].benchmark1;
    benchmark2.value = desvEstData[0].benchmark2;
    benchmark3.value = desvEstData[0].benchmark3;
    benchmark4.value = desvEstData[0].benchmark4;
    benchmark5.value = desvEstData[0].benchmark5;
    benchmark6.value = desvEstData[0].benchmark6;
    benchmark7.value = desvEstData[0].benchmark7;
    benchmark8.value = desvEstData[0].benchmark8;
    benchmark9.value = desvEstData[0].benchmark9;
    benchmark10.value = desvEstData[0].benchmark10;

    /* 
    localidad1.value = 
    localidad2.value = 
    */

    generosUnicos = [...new Set(generos.value.map((gen:any) => gen.bdinfindxvc))];
    medioTransporteUnico = [...new Set(medioTransporte.value.map((mt:any) => mt.bdinfindxvc))];
    tiempoLlegadaUnico = [...new Set(tiempoLlegada.value.map((tl:any) => tl.bdinfindxvc))];
    cantidadReunionesUnico = [...new Set(cantidadReuniones.value.map((cr:any) => cr.bdinfindxvc))];
    oportunidadesMejoraUnico = [...new Set(oportunidadesMejora.value.map((om:any) => om.bdinfindxvc))];
    seguirDesarrollandomeUnico = [];
    oportunidadesEmpleoUnico = [];
    cantidadEmpleosUnico = [];
    padecimientoSaludUnico = [];
    dependientesEconomicosUnico = [];
    tiempoGenteACargoUnico = [];
    modalidadTrabajoUnico = [];
    describirOrganizacionUnico = [];
    añosTrabajoUnico = [];
    areaUnico = [];
    cargoUnico = [];
    cargoMologadoUnico = [];
    educacionUnico = [];
    generacionUnico = [];
    console.log("GENEROS: ", generosUnicos );
    //console.log("BDBD010: ", bdbd010Data.value.map((bdbd:any) => bdbd.bdcargoho));
    /* tableData.value = transformData(data);
    updateFormattedData(); */
  }
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
  // Crear una nueva hoja de trabajo
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData.value, {
    header: headers.value.map(header => header.title)
  });

  // Crear un libro de trabajo y agregar la hoja de trabajo
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Datos');

  // Generar el archivo Excel y descargarlo
  XLSX.writeFile(wb, 'tablapivote.xlsx');
};

// Lifecycle hook para cargar datos al montar el componente
onMounted(() => {
  const empresaId = route.query.empresa ? Number(route.query.empresa) : null;
  empresa.value = isNaN(empresaId) ? null : empresaId;
  empresafounded(empresa.value);
  dimensionsFounded(empresa.value);
  answersFounded(empresa.value);
});
</script>

<style scoped>
.tabla_container {
  padding: 0 30px
}
</style>
