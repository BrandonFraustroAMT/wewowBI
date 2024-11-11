<template>
  <section
    class="menu"
  >
    <div class="menu-slice">
      <div class="menu-slice__container">
        <div class="menu-slice__empresa">

          <div class="menu-slice__title">
            <h3>{{ empresaData.empnombre }}</h3>
          </div>
        </div>
        
        <div class="menu-slice__text">
          <nav class="menu-nav">
            <ul class="menu-slice__link">
              <li><NuxtLink :to="buildLink('/portada')">Portada</NuxtLink></li>
              <li><NuxtLink :to="buildLink('/reporteejecutivo')">Reporte Ejecutivo</NuxtLink></li>
              <li><NuxtLink :to="buildLink('/tablapivote')">Tabla Pivote</NuxtLink></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <section class="paises">
      <div class="paises-container">
        <div class="paises-container__img">
          <div class="dropdown-container">
            <button class="dropdown-button" @click="toggleDropdown">
              Filtro
              <span :class="dropdownOpen ? 'rotate-up' : 'rotate-down'">&#9662;</span> <!-- Icono de flecha -->
            </button>
          
            <!-- Dropdown Menu -->
            <div v-if="dropdownOpen" class="dropdown-menu">
              <ul>
                <!-- Sin Filtro -->
                <div class="dropdown-menu__container">
                  <p class="dropdown-menu__title">Sin filtro</p>
                  <li @click="handleClick('Sinfiltro')">
                    Sin filtro
                  </li>
                </div>
                <!-- Pais de Certificacion -->
                <div class="dropdown-menu__container">
                  <p class="dropdown-menu__title">Pais de certificación</p>
                  <li @click="handleClick('Paiscertificacion')">
                  </li>
                </div>
                <!-- Business Unit -->
                <div class="dropdown-menu__container">
                  <p class="dropdown-menu__title">Business Unit</p>
                  <li @click="handleClick('Businessunit')">
                  </li>
                </div>
              
                <!-- País -->
                <div class="dropdown-menu__container">
                  <p class="dropdown-menu__title">País</p>
                  <ul v-if="selectedOption === 'Pais' || selectedOption === 'Sinfiltro'">
                    <li v-for="(pais, index) in paisUnico" :key="index" >
                      <div @click="handleClick('Pais', pais)" class="dropdown-menu__content-list">
                        {{ pais }}
                      </div>
                    </li>
                  </ul>
                </div>
              
                <!-- Localidad 1 -->
                <div class="dropdown-menu__container">
                  <p class="dropdown-menu__title">Localidad 1</p>
                  <ul v-if="selectedOption === 'Localidad1' || selectedOption === 'Sinfiltro'">
                    <li v-for="(localidad1, index) in localidad1Unico" :key="index">
                      <div @click="handleClick('Localidad1', localidad1)" class="dropdown-menu__content-list">
                        {{ localidad1 }}
                      </div>
                    </li>
                  </ul>
                </div>
              
                <!-- Localidad 2 -->
                <div class="dropdown-menu__container">
                  <p class="dropdown-menu__title">Localidad 2</p>
                  <ul v-if="selectedOption === 'Localidad2' || selectedOption === 'Sinfiltro'">
                    <li v-for="(localidad2, index) in localidad2Unico" :key="index">
                      <div @click="handleClick('Localidad2', localidad2)" class="dropdown-menu__content-list">
                        {{ localidad2 }}
                      </div>
                    </li>
                  </ul>
                </div>
                <!-- Lideres -->
                <!-- <p class="dropdown-menu__title">País</p>
                <li @click="handleClick('Lideres')">
                  Lideres
                </li> -->
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>

import { onMounted, ref, computed } from 'vue';
import { useRoute } from '#app';
import empresaService from '~/services/Empresas';
import respuestasService from '~/services/Respuestas';

const route = useRoute();
const empresaData = ref({});
const isOpen = ref(false)
const emit = defineEmits(['applyFilter', 'exportExcel']);


const respuestasData = ref([]);
const localidad1 = ref({});  
const localidad2 = ref({});
const pais = ref({});
let localidad1Unico = [];
let localidad2Unico = [];
let paisUnico = [];

const dropdownOpen = ref(false);
const selectedOption = ref('Sinfiltro'); 

// Recibimos el valor de filterData desde dimensiones.vue
const props = defineProps({
  filterData: {
    type: Object,
    default: () => ({}) // Valor por defecto
  },
  empresa: {
    type: Number,
    required: true,
  },
  mod: {
    type: Number,
    required: true,
  },
  sub: {
    type: Number,
    required: true,
  },
});

// Alternar el menú dropdown
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const empresafounded = async (id) => {
  if (id) {
    const data = await empresaService.getEmpresaId(id);
    empresaData.value = data;

    const dataAnswers = await respuestasService.getAnswersID(id);
    
    respuestasData.value = dataAnswers;
    const dataRespuestas = respuestasData.value.filter((rd) => rd.bid.bdinfidlinn == 1 && rd.bid.bdinfidindn == 1)
    localidad1.value = dataRespuestas.map((dr) => dr.bdinflocal);
    localidad2.value = dataRespuestas.map((dr) => dr.bdinflocalb);
    pais.value = dataRespuestas.map((dr) => dr.bdinfcont);
    paisUnico = [...new Set(pais.value.filter((mt) => mt !== 'VACANTE').map((mt) => mt))];
    localidad1Unico = [...new Set(localidad1.value.filter((mt) => mt !== 'VACANTE').map((mt) => mt))];
    localidad2Unico = [...new Set(localidad2.value.filter((mt) => mt !== 'VACANTE').map((mt) => mt))];

  }
};


const buildLink = (path) => {
  const query = { ...route.query }; // Clona los parámetros de consulta actuales
  return { path, query }; // Devuelve la ruta con los parámetros de consulta
};

// Computed para verificar si la ruta es /tablapivote/dimensiones
const isTablePivotePage = computed(() => {
  return route.path.startsWith('/tablapivote/');
});


// Define el método `applyFilter` que manejará el filtro
const applyFilter = (filterData) => {
  emit('applyFilter', filterData);
};

// Llama a la función empresafounded cuando se monte el componente
onMounted(() => {
  empresafounded(props.empresa);
});


/* BOTON FILTRO */
const handleClick = (option, value = null) => {
  selectedOption.value = option;
  // Actualiza filterData con el valor seleccionado
  const filterData = { ...props.filterData };

  if (option === 'Pais') {
    filterData.pais = value;
  } else if (option === 'Localidad1') {
    filterData.localidad1 = value;
  } else if (option === 'Localidad2') {
    filterData.localidad2 = value;
  } else if (option === 'Sinfiltro') {
    filterData.pais = null;
    filterData.localidad1 = null;
    filterData.localidad2 = null;
  } else if (option === 'Paiscertificacion') {
    filterData.pais = null;
    filterData.localidad1 = null;
    filterData.localidad2 = null;
  } else if (option === 'Businessunit') {
    filterData.pais = null;
    filterData.localidad1 = null;
    filterData.localidad2 = null;
  } else if (option === 'Lideres') {
    filterData.pais = null;
    filterData.localidad1 = null;
    filterData.localidad2 = null;
  }

  // Emitir los datos del filtro actualizados
  applyFilter(filterData);
};

// Verifica cambios en los props (en caso de que cambie la empresa)
watch(() => props.empresa, (newEmpresa) => {
  if (newEmpresa) {
    empresafounded(newEmpresa);
  }
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
    font-weight: 500;
    font-size: 1.5rem;
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
  .tablas-pivote {
    width: 50%;
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

  .dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-button {
  background-color: #D2DFE8;
    color: #3D495B;
    padding: 5px 10px;
    margin-right: 20px;
    border-radius: 7px;
    font-size: 0.8rem;
}
  .dropdown-button:hover{
    background-color: #bcbfc1;
  }

.dropdown-button span {
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.rotate-up {
  transform: rotate(180deg);
}

.rotate-down {
  transform: rotate(0deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 8px 0;
  width: 200px;
  max-height: 400px;
  overflow-y: scroll;
  z-index: 1000;
}

.dropdown-menu ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.dropdown-menu li {
  padding: 2px 0px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #f1f1f1;
}

.dropdown-menu__container{
  padding: 10px 5px;
}
.dropdown-menu__title{
  font-size: 0.9rem;
  text-transform: uppercase;
  border-bottom: 1px solid rgb(192, 192, 192);
}

.dropdown-menu__content-list {
  font-size: 1rem
}
</style>