<template>
    <div class="portal">
      <!-- <BarraLateral/> -->
      <div class="menu-column">
        <Menu @applyFilter="handleFilter" @exportExcel="handleExport"/>
        <div>
          <div>
              <TablaDemograficos :filterData="filterData" ref="tablaDemograficos"/>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TablaDemograficos from '~/components/TablaDemograficos.vue';

const filterData = ref({});
const tablaDemograficos = ref(null);

const handleFilter = (filterDataFromMenu) => {
  filterData.value = filterDataFromMenu;
};

const handleExport = () => {
  if (tablaDemograficos.value) {
    tablaDemograficos.value.exportToExcel();
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