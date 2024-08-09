<template>
  <div>
    <div class="portal">
      <!-- <BarraLateral/> -->
      <div class="menu-column">
        <Menu :empresa="empresa" />
        <h2>Portada</h2>
      </div>
    </div>
  </div>
</template>

<script setup="ts">

import { onMounted, ref } from 'vue';
import { useRoute } from '#app';

const route = useRoute();
const empresa = ref(0);

onMounted(() => {
  const empresaId = route.query.empresa ? Number(route.query.empresa) : null;
  empresa.value = isNaN(empresaId) ? null : empresaId;
  //console.log("Empresa ", empresa.value);
});
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
