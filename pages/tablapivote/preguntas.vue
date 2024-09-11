<template>
    <div class="portal">
      <!-- <BarraLateral/> -->
      <div class="menu-column">
        <Menu :filterData="filterData" @applyFilter="handleFilter" @exportExcel="handleExport"/>
        <div>
          <div>
            <TablaPreguntas :filterData="filterData" ref="tablaPreguntas"/>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TablaPreguntas from '~/components/TablaPreguntas.vue';

const filterData = ref({});
const tablaPreguntas = ref(null);

const handleFilter = (filterDataFromMenu) => {
  filterData.value = filterDataFromMenu;
};

const handleExport = () => {
  if (tablaPreguntas.value) {
    tablaPreguntas.value.exportToExcel();
  }
};
</script>

<style>
.portal {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.menu-column {
  width: 100%;
}
</style>