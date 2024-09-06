<template>
  <div class="portal">
    <!-- <BarraLateral/> -->
    <div class="menu-column">
      <Menu @applyFilter="handleFilter" @exportExcel="handleExport"/>
      <div>
        <div>
            <TablaVacio :filterData="filterData" ref="tablaVacio"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TablaVacio from '~/components/TablaVacio.vue';

const filterData = ref({});
const tablaVacio = ref(null);

const handleFilter = (filterDataFromMenu) => {
filterData.value = filterDataFromMenu;
};

const handleExport = () => {
if (tablaVacio.value) {
  tablaVacio.value.exportToExcel();
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