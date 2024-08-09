<template>
  <div>
    <caption>{{ empresaData.empnombre }}</caption>
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
          <td v-if="item.level === 'afirmacion'">
            {{ item.result }}
          </td>
          <td v-if="item.level === 'afirmacion'">
            {{ item.val1 }}
          </td>
          <td v-if="item.level === 'afirmacion'">
            {{ item.val2 }}
          </td>
          <td v-if="item.level === 'afirmacion'">
            {{ item.val3 }}
          </td>
          <td v-if="item.level === 'dimension'">{{ item.result }}</td>
          <td v-if="item.level === 'dimension'">{{ item.val1 }}</td>
          <td v-if="item.level === 'dimension'">{{ item.val2 }}</td>
          <td v-if="item.level === 'dimension'">{{ item.val3 }}</td>
          <td v-if="item.level === 'subdimension'">{{ item.result }}</td>
          <td v-if="item.level === 'subdimension'">{{ item.val1 }}</td>
          <td v-if="item.level === 'subdimension'">{{ item.val2 }}</td>
          <td v-if="item.level === 'subdimension'">{{ item.val3 }}</td>
          <td v-if="item.level === 'competencia'">{{ item.result }}</td>
          <td v-if="item.level === 'competencia'">{{ item.val1 }}</td>
          <td v-if="item.level === 'competencia'">{{ item.val2 }}</td>
          <td v-if="item.level === 'competencia'">{{ item.val3 }}</td>
        </tr>
      </template>
    </v-data-table-virtual>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from '#app';
import empresasService from '~/services/Empresas';
import dimensionesService from '~/services/Dimensiones';
import respuestasBdinfService from '~/services/RespuestasBdinf';

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

const headers = ref([
  { title: 'Modelo', sortable: false,  key: 'dimension' },
  { title: 'Resultado (%)', sortable: false,  key: 'result' },
  { title: 'Valor1', sortable: false, key: 'val1' },
  { title: 'Valor2', sortable: false,  key: 'val2' },
  { title: 'Valor3', sortable: false, key: 'val3' },
]);
// Filtrar los datos según la selección
const applyFilter = () => {
  console.log("Aplicando filtro con datos:", props.filterData);
  formattedData.value = [];

  if (props.filterData.rows.includes('Dimensiones')) {
    formattedData.value = tableData.value
      .filter(item => item.level === 'dimension')
      .map(item => ({ ...item, expandable: false }));
  }

  if (props.filterData.rows.includes('Subdimensiones')) {
    formattedData.value = tableData.value
      .filter(item => item.level === 'dimension' || item.level === 'subdimension')
      .map(item => ({ 
        ...item, 
        expandable: item.level === 'dimension' 
      }));
  }

  if (props.filterData.rows.includes('Competencias')) {
    formattedData.value = tableData.value
      .filter(item => item.level === 'dimension' || item.level === 'subdimension' || item.level === 'competencia')
      .map(item => ({ 
        ...item, 
        expandable: item.level === 'dimension' || item.level === 'subdimension' 
      }));
  }

  if (props.filterData.rows.includes('Afirmaciones')) {
    formattedData.value = tableData.value
      .filter(item => item.level === 'dimension' || item.level === 'subdimension' || item.level === 'competencia' || item.level === 'afirmacion')
      .map(item => ({ 
        ...item, 
        expandable: item.level === 'dimension' || item.level === 'subdimension' || item.level === 'competencia' 
      }));
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
    tableData.value = transformData(data);
    updateFormattedData();
  }
};

// Función para obtener las respuestas por ID de empresa
const answersFounded = async (id: number) => {
  if (id) {
    const data = await respuestasBdinfService.getRespuestas(id);
    console.log("Respuestas empresa: ", data);
    /* tableData.value = transformData(data);
    updateFormattedData(); */
  }
};

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

</style>
