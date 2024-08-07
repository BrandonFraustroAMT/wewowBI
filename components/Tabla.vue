<template>
  <div>
    <v-data-table-virtual
      class="fixed-header-table"
      :headers="headers"
      height="550"
      :items="formattedData"
      item-value="name"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td :style="{ paddingLeft: `${getPadding(item.level)}px` }">
            <v-btn
              v-if="item.level !== 'afirmacion'"
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
          <td v-if="item.level === 'afirmacion'" class="result-column">
            {{ item.result }}
          </td>
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

// Variables reactivas
const route = useRoute();
const empresa = ref<number>(0);
const empresaData = ref({});
const tableData = ref([]);
const formattedData = ref([]);
const expandedRows = ref(new Set<number | string>());

const headers = ref([
  { title: 'Dimensiones', sortable: false,  key: 'dimension' },
  { title: 'Resultado (%)', sortable: false,  key: 'result' },
  { title: 'Valor1', sortable: false, key: 'val1' },
  { title: 'Valor2', sortable: false,  key: 'val2' },
  { title: 'Valor3', sortable: false, key: 'val3' },
]);

// Función para transformar datos planos a la estructura jerárquica
const transformData = (data: any[]): any[] => {
  const formatted = [];
  const addedItems = new Set();

  data.forEach(item => {
    const [empId, dimId, dimDesc, subDimId, subDimDesc, competencia, afirId, afirDesc] = item;

    if (!addedItems.has(dimId)) {
      formatted.push({
        name: dimDesc,
        level: 'dimension',
        id: dimId,
      });
      addedItems.add(dimId);
    }

    if (!addedItems.has(`${dimId}-${subDimId}`)) {
      formatted.push({
        name: subDimDesc.trim(),
        level: 'subdimension',
        id: `${dimId}-${subDimId}`,
        parent: dimId,
      });
      addedItems.add(`${dimId}-${subDimId}`);
    }

    if (!addedItems.has(`${subDimId}-${competencia}`)) {
      formatted.push({
        name: competencia,
        level: 'competencia',
        id: `${subDimId}-${competencia}`,
        parent: `${dimId}-${subDimId}`,
      });
      addedItems.add(`${subDimId}-${competencia}`);
    }

    formatted.push({
      name: afirDesc.trim(),
      level: 'afirmacion',
      id: `${subDimId}-${competencia}-${afirId}`,
      parent: `${subDimId}-${competencia}`,
      result: '2%',
    });
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

// Función para actualizar los datos formateados para la tabla
const updateFormattedData = () => {
  const updatedData = [];
  const addedParents = new Set();

  tableData.value.forEach(item => {
    if (item.level === 'dimension' || expandedRows.value.has(item.parent)) {
      updatedData.push(item);
      if (item.level !== 'afirmacion') {
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
});

// Configuraciones de Vuetify

</script>

<style scoped>
button {
  padding: 10px 20px;
  margin-bottom: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.table-container {
  position: relative; /* Contenedor relativo para el header fijo */
}

.fixed-header-table .v-data-table__wrapper {
  overflow-y: auto; /* Habilitar el desplazamiento */
  max-height: 550px; /* Ajusta la altura máxima según sea necesario */
}

.fixed-header-table .v-data-table__header {
  position: sticky;
  top: 0;
  background-color: white; /* Asegúrate de que el fondo sea visible */
  z-index: 1; /* Asegúrate de que el header esté sobre otros elementos */
}
</style>
