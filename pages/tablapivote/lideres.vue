<template>
    <div class="portal">
      <!-- <BarraLateral/> -->
      <div class="menu-column">
        <Menu @applyFilter="handleFilter" @exportExcel="handleExport"/>
        <div>
          <div>
              <TablaLideres :filterData="filterData" ref="tablaLideres"/>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TablaLideres from '~/components/TablaLideres.vue';

const filterData = ref({});
const tablaLideres = ref(null);

const handleFilter = (filterDataFromMenu) => {
  filterData.value = filterDataFromMenu;
};

const handleExport = () => {
  if (tablaLideres.value) {
    tablaLideres.value.exportToExcel();
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