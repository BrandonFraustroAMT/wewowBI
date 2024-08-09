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
    <section class="paises">
      <div class="paises-container">
        <div class="paises-container__img">
          <button class="btn_menu">Filtro</button>
        </div>
        <div class="paises-container__buttons">
          <div class="btn_campos">
              <UButton label="Campos" @click="isOpen = true" />
              <UModal v-model="isOpen">
                <FiltroCampos @applyFilter="applyFilter"/>
              </UModal>
          </div>
          <div class="paises-container__img">
            <button class="btn_menu">Exportar</button>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import { useRoute } from '#app';
import empresaService from '~/services/Empresas';

const route = useRoute();
const empresa = ref(0);
const empresaData = ref({});
const isOpen = ref(false)
const emit = defineEmits(['applyFilter']);

const empresafounded = async (id) => {
  if (id) {
    const data = await empresaService.getEmpresaId(id);
    empresaData.value = data;
    console.log("Datos de la empresa: ", empresaData.value);
  }
};

// Define el método `applyFilter` que manejará el filtro
const applyFilter = (filterData) => {
  console.log('Filtro aplicado desde Menu:', filterData);
  // Emitir el evento hacia el componente padre si es necesario
  emit('applyFilter', filterData);
};

onMounted(() => {
  const empresaId = route.query.empresa ? Number(route.query.empresa) : null;
  empresa.value = isNaN(empresaId) ? null : empresaId;
  empresafounded(empresa.value);
});

</script>

<style>
  .menu {
    width: 100%;
    background: rgb(17,74,133);
    background: linear-gradient(180deg, rgba(17,74,133,1) 0%, rgba(47,164,207,1) 100%);
  }
  .menu-slice {
    width: 100%;
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

  .menu-slice__title{
    color: #A2BDD0;
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
    justify-content: space-around;
    color: #A2BDD0;
  }
  .menu-slice__link a{
    color: #A2BDD0;
    transition: scale 1s ease-in;
  }
  .menu-slice__link a:hover{
    color: #a5afb6;
    transform: scale(0.8);
  }

  .paises {
    width: 100%;
    height: 60px;
    border-top: 1px solid rgb(144, 144, 144);
    border-bottom: 1px solid black;
  }
  .paises-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-left: 40px;
  }

  .paises-container__image {
    width: 60px;
    height: 30px;
    border-radius: 10px;
    background-color: #DFD3C3;
  }
  .paises-container__img {
    display: flex;
    flex-direction: column;
  }
  .paises-container__img p{
    font-size: 0.5rem
  }
  .paises-container__img img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .paises-container__buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .sm\:max-w-lg {
      max-width: 45rem;
  }

  .btn_menu {
    background-color: #D2DFE8;
    color: #3D495B;
    padding: 5px 10px;
    margin-right: 20px;
    border-radius: 7px;
    font-size: 0.8rem;
  }
  .btn_menu:hover{
    background-color: #bcbfc1;
  }
  .dark\:bg-primary-400:is(.dark *) {
    background-color: #D2DFE8;
    color: #3D495B;
    padding: 5px 10px;
    margin-right: 20px;
    border-radius: 7px;
    font-size: 0.8rem;
  } 
  .dark\:bg-primary-400:is(.dark *):hover {
    background-color: #bcbfc1;
  } 
  .text-white {
    color: #3D495B !important;
  }

  .btn_campos {
    margin-right: 20px;
  }
</style>