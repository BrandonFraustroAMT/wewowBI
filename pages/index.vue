<template>
  <div>
    <!-- Comprueba si el documento está cargado -->
    <div class="portal">
      <BarraLateral v-if="barraLateralSlice" :slice="barraLateralSlice" />
      <div class="menu-column">
        <Menu v-if="menuSlice" :slice="menuSlice" />
        <BarraPaises />
        <Tabla />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { SliceZone, usePrismic } from '@prismicio/vue';

// Importa tus slices aquí
import BarraLateral from '../slices/BarraLateral/index.vue'; // Ajusta la ruta según tu estructura de carpetas
import Menu from '../slices/Menu/index.vue'; // Ajusta la ruta según tu estructura de carpetas
import BarraPaises from '../components/BarraPaises.vue'; // Ajusta la ruta según tu estructura de carpetas

// Define los componentes de los slices
const components = {
  barra_lateral: BarraLateral,
  menu: Menu,
};

const document = ref(null);
const menuSlice = ref(null);
const barraLateralSlice = ref(null);
const { client } = usePrismic();

// Función para obtener datos de Prismic
const fetchData = async () => {
  try {
    const response = await client.getByUID('portal', 'portal'); // Asegúrate de que el UID y el tipo de documento son correctos
    console.log(response);
    document.value = response;
    menuSlice.value = response.data.slices.find(slice => slice.slice_type === 'menu');
    barraLateralSlice.value = response.data.slices.find(slice => slice.slice_type === 'barra_lateral');
  } catch (error) {
    console.log('Error fetching document:', error);
  }
};

// Llama a fetchData cuando el componente se monte
onMounted(() => {
  fetchData();
});
</script>

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--backgroundBlack);
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid #007bff;
  border-top-color: transparent;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.portal {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.menu-column {
  width: 100%;
}

</style>
