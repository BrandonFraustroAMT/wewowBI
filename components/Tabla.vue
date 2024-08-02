<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from '#app';
import empresasService from '~/services/Empresas';

const route = useRoute();
const empresa = ref<number>(0);
const empresaData = ref({});

const empresafounded = async (id:number) => {
  if (id) {
    const data = await empresasService.getEmpresaId(id);
    empresaData.value = data;
  }
};

onMounted(() => {
  const empresaId = route.query.empresa ? Number(route.query.empresa) : null;
  empresa.value = isNaN(empresaId) ? null : empresaId;
  empresafounded(empresa.value);
});


interface Afirmacion {
  id?: number;
  name?: string;
  valor?: String;
}
interface Competencia {
  id?: number;
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

const tableData = ref<Dimension[]>([
  {
    id: 1,
    dimension: "Talento",
    subdimension: [
      {
        id: 11,
        name: "Querer",
        competencia: [
          {
            id: 111,
            name: "Flexible",
            afirmacion: [
              {
                id: 1111,
                name: "Los trabajadores se adaptan al cambio",
                valor: ""
              }
            ]
          },
          {
            id: 112,
            name: "Compañerismo"
          },
          {
            id: 113,
            name: "Energizer"
          },
        ]
      },
      {
        id: 12,
        name: "Sentir"
      },
      {
        id: 13,
        name: "Saber"
      },
      {
        id: 14,
        name: "Hacer"
      }
    ]
  },
  {
    id: 2,
    dimension: "Liderazgo",
    subdimension: [
      {
        id: 21,
        name: "Auto-liderazgo"
      },
      {
        id: 22,
        name: "Liderazgo orientado a los demás"
      },
      {
        id: 23,
        name: "Liderazgo hacia el negocio"
      }
    ]
  },
  {
    id: 3,
    dimension: "Cultura",
    subdimension: [
      {
        id: 31,
        name: "Experiencia del colaborador"
      },
      {
        id: 32,
        name: "Gestión del cambio"
      },
      {
        id: 33,
        name: "Valores"
      },
      {
        id: 34,
        name: "Propósito"
      }
    ]
  }
]);

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
          <caption>Empresa</caption>
          <tbody>
            <!-- EJEMPLO ENCABEZADO -->
              <tr class="encabezado">
                <td class="dimension">Dimension</td>
              </tr>
              <tr class="encabezado">
                <td :style="{ paddingLeft: '20px' }">Subdimension</td>
              </tr>
              <tr class="encabezado">
                <td :style="{ paddingLeft: '40px' }">competencia</td>
              </tr>
              <tr class="encabezado">
                <td :style="{ paddingLeft: '60px' }">afirmacion</td>
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
    max-height: 600px; 
    overflow-x: auto;
    overflow-y: auto;
  }

  .table {
    margin: 5px 5px;
    border: 1px solid black
  }

  .encabezado {
    background-color: rgb(186, 182, 182);
  }
</style>