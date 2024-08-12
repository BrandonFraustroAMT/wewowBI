<template>
    <div class="portal">
      <!-- <BarraLateral/> -->
      <div class="menu-column">
        <Menu @applyFilter="handleFilter"/>
        <div>
          <div>
              <Tabla :filterData="filterData"/>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      filterData: {},
    };
  },
  methods: {
    handleFilter(filterData) {
      console.log('Filtro aplicado:', filterData);
      this.filterData = filterData;
    }
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