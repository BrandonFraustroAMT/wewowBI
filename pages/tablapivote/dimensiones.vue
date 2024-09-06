<template>
    <div class="portal">
      <!-- <BarraLateral/> -->
      <div class="menu-column">
        <Menu @applyFilter="handleFilter" @exportExcel="handleExport"/>
        <div>
          <div>
              <TablaDimensiones :filterData="filterData" ref="tablaDimensiones"/>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TablaDimensiones from '~/components/TablaDimensiones.vue';

const filterData = ref({});
const tablaDimensiones = ref(null);

const handleFilter = (filterDataFromMenu) => {
  filterData.value = filterDataFromMenu;
};

const handleExport = () => {
  if (tablaDimensiones.value) {
    tablaDimensiones.value.exportToExcel();
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