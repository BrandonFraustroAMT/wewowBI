<template>
  <section
    class="menu"
  >
    <div class="menu-slice">
      <div class="menu-slice__container">
        <div class="menu-slice__empresa">
          <div class="menu-slice__empresa-logo">
            <img src="" alt="">
          </div>
          <div class="menu-slice__title">
            <h3>{{ empresaData.empnombre }}</h3>
          </div>
        </div>
        
        <div class="menu-slice__text">
          <nav class="menu-nav">
            <ul class="menu-slice__link">
              <li><NuxtLink to="/portada">Portada</NuxtLink></li>
              <li><NuxtLink to="/reporteejecutivo">Reporte Ejecutivo</NuxtLink></li>
              <li><NuxtLink to="/tablapivote">Tabla Pivote</NuxtLink></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </section>
  <section class="paises">
    <div class="paises-container">
      <div class="paises-container__image">
      </div>
    </div>
  </section>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import { useRoute } from '#app';
import empresaService from '~/services/Empresas';

const route = useRoute();
const empresa = ref(0);
const empresaData = ref({});

const empresafounded = async (id) => {
  if (id) {
    const data = await empresaService.getEmpresaId(id);
    empresaData.value = data;
    //console.log("Datos de la empresa: ", empresaData.value);
  }
};

onMounted(() => {
  const empresaId = route.query.empresa ? Number(route.query.empresa) : null;
  empresa.value = isNaN(empresaId) ? null : empresaId;
  empresafounded(empresa.value);
});

/* const props = defineProps({
  empresa: {
    type: Number,
    default: null
  }
})

const { empresa } = toRefs(props);

const empresaData = ref({});

const empresafounded = async (id) => {
  if (id) {
    const data = await empresaService.getEmpresaId(id);
    empresaData.value = data;
    console.log(empresaData);
  }
};

watch(empresa, (newId) => {
  empresafounded(newId);
}, { immediate: true });

onMounted(() => {
  console.log(empresa.value);
  if (empresa.value) {
    empresafounded(empresa.value);
  }
});
 */
</script>

<style>
  .menu {
    width: 100%;
  }
  .menu-slice {
    width: 100%;
    background-color: rgba(6, 142, 240, 1.0)
  }

  .menu-slice__container {
    width: 70%;
    height: 80px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    padding: 0 40px;
    align-items: center;
  }

  .menu-slice__empresa {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .menu-slice__empresa-logo {
    width: 100px;
    height: 50px;
    border-radius: 10px;
    margin-right: 10px;
    background-color: #DFD3C3;
  }

  .menu-slice__logo {
    width: 10%;
    height: 50px;
    border-radius: 10px;
    background-color: #DFD3C3;
  }

  
  .menu-slice__text {
      width: 50%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
  }

  .menu-nav {
    width: 100%;
  }

  .menu-slice__link {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around
  }

  .paises {
    width: 100%;
    height: 60px;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    background-color: rgba(6, 142, 240, 1.0);
  }
  .paises-container {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 10px;
  }

  .paises-container__image {
    width: 60px;
    height: 30px;
    border-radius: 10px;
    background-color: #DFD3C3;
  }
</style>