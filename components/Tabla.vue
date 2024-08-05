<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from '#app';
import empresasService from '~/services/Empresas';
import dimensionesService from '~/services/Dimensiones';

// Interfaces para las estructuras de datos
interface Afirmacion {
  id?: number;
  name?: string;
  valor?: string;
}

interface Competencia {
  name?: string;
  afirmacion?: Afirmacion[];
}

interface Subdimension {
  id?: number;
  name?: string;
  competencia?: Competencia[];
}

interface Dimension {
  id: number;
  dimension: string;
  subdimension: Subdimension[];
}

// Variables reactivas
const route = useRoute();
const empresa = ref<number>(0);
const empresaData = ref({});
const dimensiones = ref<Dimension[]>([]);
// Datos iniciales de ejemplo
const tableData = ref<Dimension[]>([]);

// Función para transformar datos planos a la estructura jerárquica
const transformData = (data: any[]): Dimension[] => {
  const dimensionsMap = new Map<number, Dimension>();

  data.forEach(item => {
    const [empId, dimId, dimDesc, subDimId, subDimDesc, competencia, afirId, afirDesc] = item;
    if (!dimensionsMap.has(dimId)) {
      dimensionsMap.set(dimId, {
        id: dimId,
        dimension: dimDesc,
        subdimension: []
      });
    }

    const dimension = dimensionsMap.get(dimId)!;
    let subdimension = dimension.subdimension.find(sd => sd.id === subDimId);

    if (!subdimension) {
      subdimension = {
        id: subDimId,
        name: subDimDesc.trim(),
        competencia: []
      };
      dimension.subdimension.push(subdimension);
    }

    let competenciaObj = subdimension.competencia.find(c => c.name === competencia);

    if (!competenciaObj) {
      competenciaObj = {
        name: competencia,
        afirmacion: []
      };
      subdimension.competencia.push(competenciaObj);
    }

    const afirmacion: Afirmacion = {
      id: afirId,
      name: afirDesc.trim()
    };
    competenciaObj.afirmacion.push(afirmacion);
  });

  return Array.from(dimensionsMap.values());
};

// Función para obtener los datos de la empresa por ID
const empresafounded = async (id: number) => {
  if (id) {
    const data = await empresasService.getEmpresaId(id);
    empresaData.value = data;
    //console.log(empresaData);
  }
};

// Función para obtener las dimensiones por ID de empresa
const dimensionsFounded = async (id: number) => {
  if (id) {
    const data = await dimensionesService.getDimensionsByEmp(id);
    console.log(data);
    tableData.value = transformData(data);  // Transformar y asignar los datos
  }
};

// Lifecycle hook para cargar datos al montar el componente
onMounted(() => {
  const empresaId = route.query.empresa ? Number(route.query.empresa) : null;
  empresa.value = isNaN(empresaId) ? null : empresaId;
  empresafounded(empresa.value);
  dimensionsFounded(empresa.value);
});

const expandedRows = ref(new Set<number>());

const toggleRow = (id: number) => {
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id);
  } else {
    expandedRows.value.add(id);
  }
};
</script>

<template>
  <section class="tabla">
    <div class="tabla-container">
      <div class="tabla-container__scroll">
        <table class="table">
          <caption>{{ empresaData.empnombre }}</caption>
          <tbody>
            <!-- EJEMPLO ENCABEZADO -->
              <tr class="encabezado">
                <td class="dimension">Dimension</td>
              </tr>
              <tr class="encabezado">
                <td :style="{ paddingLeft: '10px' }">Subdimension</td>
              </tr>
              <tr class="encabezado">
                <td :style="{ paddingLeft: '20px' }">competencia</td>
              </tr>
              <tr class="encabezado">
                <td :style="{ paddingLeft: '30px' }">Afirmacion</td>
              </tr>
            <!-- DATA DB -->
            <template v-for="dimension in tableData" :key="dimension.id">
              <tr @click="toggleRow(dimension.id)">
                <td class="dimension">{{ dimension.dimension }}</td>
              </tr>
              <template v-if="expandedRows.has(dimension.id)">
                <template v-for="subdimension in dimension.subdimension" :key="subdimension.id || subdimension.name">
                  <tr @click="toggleRow(subdimension.id)">
                    <td :style="{ paddingLeft: '20px' }" class="subdimension">{{ subdimension.name }}</td>
                  </tr>
                  <template v-if="expandedRows.has(subdimension.id)">
                    <template v-for="competencia in subdimension.competencia" :key="competencia.id || competencia.name">
                      <tr @click="toggleRow(competencia.id)">
                        <td :style="{ paddingLeft: '40px' }">{{ competencia.name }}</td>
                      </tr>
                      <template v-if="expandedRows.has(competencia.id)">
                        <template v-for="afirmacion in competencia.afirmacion" :key="afirmacion.id || afirmacion.name">
                          <tr>
                            <td :style="{ paddingLeft: '60px' }">{{ afirmacion.name }}</td>
                          </tr>
                        </template>
                      </template>
                    </template>
                  </template>
                </template>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style>
  .tabla {
    width: 100%;
  }
  .tabla-container__scroll {
    width: 100%;
    margin: 10px 10px;
    max-width: 100%;
    max-height: 550px; 
    overflow-x: auto;
    overflow-y: auto;
  }

  .table {
    width: 700px;
    margin: 5px 5px;
    border: 1px solid black
  }

  .encabezado {
    background-color: rgb(186, 182, 182);
  }
</style>