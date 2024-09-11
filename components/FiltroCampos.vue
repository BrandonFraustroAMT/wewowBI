<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const rows = ref<any[]>([]);
const columns = ref<any[]>([]);
const valores = ref<any[]>([]);
const validDrop = ref(null); // Estado para validar el contenedor activo
const emit = defineEmits(['applyFilter', 'cancel']);

// Recibimos initialFilterData como prop
const props = defineProps({
  initialFilterData: {
    type: Object,
    default: () => ({}) // Valor por defecto
  }
});

// Lista de ítems inicial, agrupando por categoría
const items = ref([
  { id: 1, name: 'Genero', category: 'demographics' },
  { id: 2, name: 'Medio de transporte', category: 'demographics' },
  { id: 3, name: 'Tiempo de llegada', category: 'demographics' },
  { id: 4, name: 'Reuniones con tu jefe', category: 'demographics' },
  { id: 5, name: 'Oportunidades', category: 'demographics' },
  { id: 6, name: 'Seguir desarrollandome', category: 'demographics' },
  { id: 7, name: 'Buscar oportunidades de empleo', category: 'demographics' },
  { id: 8, name: 'Cantidad de empleos', category: 'demographics' },
  { id: 9, name: 'Padecimiento de salud crónico', category: 'demographics' },
  { id: 10, name: 'Dependientes económicos', category: 'demographics' },
  { id: 11, name: 'Tiempo de gente a cargo', category: 'demographics' },
  { id: 12, name: 'Modalidad de trabajo', category: 'demographics' },
  { id: 13, name: 'Describir tu organización', category: 'demographics' },
  { id: 14, name: 'Area', category: 'demographics' },
  { id: 15, name: 'Cargo', category: 'demographics' },
  { id: 16, name: 'Cargo mologado', category: 'demographics' },
  { id: 17, name: 'Educación', category: 'demographics' },
  { id: 18, name: 'Generación', category: 'demographics' },
  { id: 19, name: 'Localidad 1', category: 'demographics' },
  { id: 20, name: 'Localidad 2', category: 'demographics' },
  { id: 21, name: 'Nivel estructural 1', category: 'demographics' },
  { id: 22, name: 'Nivel estructural 2', category: 'demographics' },
  { id: 23, name: 'Nivel estructural 3', category: 'demographics' },
  { id: 24, name: 'Nivel estructural 4', category: 'demographics' },
  { id: 25, name: 'Nivel estructural 5', category: 'demographics' },
  { id: 26, name: 'Nivel estructural 6', category: 'demographics' },
  { id: 27, name: 'Nivel estructural 7', category: 'demographics' },
  { id: 28, name: 'Nivel estructural 8', category: 'demographics' },
  { id: 29, name: 'Nivel estructural 9', category: 'demographics' },
  { id: 30, name: 'Nivel estructural 10', category: 'demographics' },
  { id: 31, name: 'Pais', category: 'demographics' },
  { id: 32, name: 'Dimensiones', category: 'modelo' },
  { id: 33, name: 'Subdimensiones', category: 'modelo' },
  { id: 34, name: 'Competencias', category: 'modelo' },
  { id: 35, name: 'Afirmaciones', category: 'modelo' },
  { id: 36, name: 'Valor 1', category: 'valoresCalculados' },
  { id: 37, name: 'Valor 2', category: 'valoresCalculados' },
  { id: 38, name: 'Valor 3', category: 'valoresCalculados' },
  { id: 39, name: 'Valor 4', category: 'valoresCalculados' },
  { id: 40, name: 'Valor 5', category: 'valoresCalculados' },
  { id: 41, name: 'Lideres', category: 'lideres' },
  { id: 42, name: '¿Qué es lo más WOW de trabajar en tu organización?', category: 'preguntas' },
  { id: 43, name: '¿Qué es lo menos WOW de trabajar en tu organización?', category: 'preguntas' },
  { id: 44, name: 'Si tu empresa fuera un vehiculo ¿Qué vehiculo seria?', category: 'preguntas' },
  { id: 45, name: 'Menciona 3 caracteristicas que explican porque tu organización sería ese vehiculo.', category: 'preguntas' },
  // Agregar más elementos
]);

// Ítem arrastrado
let draggedItem = null;

// Control de categorías expandidas
const expandedCategories = ref({});

// Función para agrupar ítems por categoría
const groupedItems = computed(() => {
  return items.value.reduce((groups, item) => {
    (groups[item.category] = groups[item.category] || []).push(item);
    return groups;
  }, {});
});

// Función para obtener el título de la categoría
const categoryTitle = (category) => {
  const titles = {
    demographics: 'Demográficos',
    modelo: 'Modelo',
    valoresCalculados: 'Valores Calculados',
    lideres: 'Líderes',
    preguntas: 'Preguntas Abiertas',
    // Agrega más títulos según las categorías
  };
  return titles[category];
};

// Función para manejar el inicio del arrastre
const onDragStart = (item) => {
  draggedItem = item; // Almacena el ítem arrastrado
};

const onDragEnter = (target) => {
  validDrop.value = isValidDrop(target);
};

const onDragLeave = () => {
  validDrop.value = null;
};

// Función para manejar el "drop"
const onDrop = (target) => {
  if (isValidDrop(target)) {
    // Añadir el ítem al contenedor de destino sin eliminarlo del contenedor principal
    if (target === 'rows') {
      if (!rows.value.some(i => i.id === draggedItem.id)) {
        rows.value.push(draggedItem);
      }
    } else if (target === 'columns') {
      if (!columns.value.some(i => i.id === draggedItem.id)) {
        columns.value.push(draggedItem);
      }
    } else if (target === 'valores') {
      if (!valores.value.some(i => i.id === draggedItem.id)) {
        valores.value.push(draggedItem);
      }
    }
  }
  draggedItem = null;
  validDrop.value = null;
};


// Valida si un ítem es válido para ser soltado en un contenedor
const isValidDrop = (target) => {
  if (!draggedItem) return false;

  if ((target === 'rows' || target === 'columns') &&
      (draggedItem.category === 'demographics' || draggedItem.category === 'modelo' || 
      draggedItem.category === 'lideres' || draggedItem.category === 'preguntas')) {
    return true;
  } else if (target === 'valores' && draggedItem.category === 'valoresCalculados') {
    return true;
  }

  return false;
};

// Función para eliminar un ítem del contenedor y regresarlo a su categoría original
const removeItem = (item, container) => {
  // Elimina el ítem del contenedor correspondiente
  if (container === 'rows') {
    rows.value = rows.value.filter(i => i.id !== item.id);
  } else if (container === 'columns') {
    columns.value = columns.value.filter(i => i.id !== item.id);
  } else if (container === 'valores') {
    valores.value = valores.value.filter(i => i.id !== item.id);
  }

  // Devuelve el ítem a la lista de 'items' en su categoría original
  if (!items.value.some(i => i.id === item.id)) {
    items.value.push(item);
  }
};

// Función para expandir o colapsar categorías
const toggleCategory = (category) => {
  expandedCategories.value[category] = !expandedCategories.value[category];
};

// Observamos los cambios en initialFilterData para inicializar los valores
watch(() => props.initialFilterData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    rows.value = newData.rows?.map(nd => items.value.find(item => item.id === nd.id)) || []; // Ejemplo para 'Dimensiones'
    columns.value = newData.columns?.map(nd => items.value.find(item => item.id === nd.id)) || []; // Ejemplo para 'Subdimensiones'
    valores.value = newData.valores?.map(nd => items.value.find(item => item.id === nd.id)) || []; // Ejemplo para 'Afirmaciones'
  }
}, { immediate: true }); // Se ejecuta inmediatamente



// Emitir filas y columnas seleccionadas cuando se haga clic en "Aplicar"
const applyFilter = () => {
  emit('applyFilter', {
    rows: rows.value,
    columns: columns.value,
    valores: valores.value,
  });
};

const cancel = () => {
  emit('cancel');
};

</script>

<template>
  <section class="filtro-campos">
    <div class="filtro-campos__container">
        <div class="filtro-campos__row">
            <div class="filtro-campos__title"><h3>Campos</h3></div>
            <div class="filtro-campos__buttons">
                <button class="btn-apply" @click="applyFilter">Aplicar</button>
                <button class="btn-cancel" @click="cancel">Cancelar</button>
            </div>
        </div>
        <div class="drag-container">
          <div class="drag-column">
              <!-- Contenedor 1: Lista de Items -->
               <div class="container">
                  <h3>Elementos</h3>
                  <div v-for="(group, category) in groupedItems" :key="category">
                    <h4>
                      {{ categoryTitle(category) }}
                      <!-- Botón para expandir/colapsar la categoría -->
                      <button @click="toggleCategory(category)">
                        {{ expandedCategories[category] ? '-' : '+' }}
                      </button>
                    </h4>
                    <!-- Mostrar elementos solo si la categoría está expandida -->
                    <div v-if="expandedCategories[category]">
                      <div
                        v-for="item in group"
                        :key="item.id"
                        @dragstart="onDragStart(item)"
                        draggable="true"
                        class="draggable-item"
                      >
                        {{ item.name }}
                      </div>
                    </div>
                  </div>
               </div>
          </div>
      
          <div class="drag-column">
              <div class="drag-col1">
                  <!-- Contenedor 2: Filas -->
                  <div 
                    class="container" 
                    :class="{ 'valid-drop': isValidDrop('rows'), 'invalid-drop': !isValidDrop('rows') }"
                    @dragover.prevent
                    @dragenter="onDragEnter('rows')"
                    @dragleave="onDragLeave"
                    @drop="onDrop('rows')"
                    style="margin-right: 10px;"
                  >
                    <h3>Filas</h3>
                    <div 
                      v-for="item in rows" 
                      :key="item.id" 
                      class="draggable-item"
                    >
                      {{ item.name }}
                      <button class="dd-button" @click="removeItem(item, 'rows')">x</button>
                    </div>
                  </div>
              
                  <!-- Contenedor 3: Columnas -->
                  <div 
                    class="container" 
                    :class="{ 'valid-drop': isValidDrop('columns'), 'invalid-drop': !isValidDrop('columns') }"
                    @dragover.prevent
                    @dragenter="onDragEnter('columns')"
                    @dragleave="onDragLeave"
                    @drop="onDrop('columns')"
                  >
                    <h3>Columnas</h3>
                    <div 
                      v-for="item in columns" 
                      :key="item.id" 
                      class="draggable-item"
                    >
                      {{ item.name }}
                      <!-- Botón para eliminar el ítem de columnas y regresarlo a 'Elementos' -->
                      <button class="dd-button" @click="removeItem(item, 'columns')">x</button>
                    </div>
                  </div>
              </div>
              <div class="drag-col2">
                  <!-- Contenedor 4: Columnas -->
                  <div 
                    class="container" 
                    :class="{ 'valid-drop': isValidDrop('valores'), 'invalid-drop': !isValidDrop('valores') }"
                    @dragover.prevent
                    @dragenter="onDragEnter('valores')"
                    @dragleave="onDragLeave"
                    @drop="onDrop('valores')"
                  >
                    <h3>Valores</h3>
                    <div 
                      v-for="item in valores" 
                      :key="item.id" 
                      class="draggable-item"
                    >
                      {{ item.name }}
                      <!-- Botón para eliminar el ítem de valores y regresarlo a 'Elementos' -->
                      <button class="dd-button" @click="removeItem(item, 'valores')">x</button>
                    </div>
                  </div>
              </div>
          </div>
        </div>
    </div>
  </section>
</template>

<style>
    .filtro-campos {
        width: 100%;
        height: 500px;
        background-color: #fff;
        box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
        font-size: 0.8rem;
    }
    .filtro-campos__container {
        display: flex;
        flex-direction: column;
    }
    .filtro-campos__row {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        padding: 30px 20px;
    }
    .filtro-campos__title{
        width: 50%;
    }
    .filtro-campos__title h3 {
        font-size: 1.2rem;
    }
    .filtro-campos__buttons {
        width: 50%;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }
    .filtro-campos__buttons button{
        padding: 5px 15px;
    }
    .btn-apply {
        background-color: #60605F;
        font-size: 0.8rem;
        color: #fff;
        border-radius: 5px;
    }
    .btn-apply:hover {
        cursor: pointer;
        background-color: #969695;
    }
    .btn-cancel {
        font-size: 0.8rem;
        border: 1px solid #60605F;
        border-radius: 5px;
    }
    .btn-cancel:hover {
        cursor: pointer;
        background-color: #969695;
    }


    .drag-container {
    width: 100%;
    display: flex;
    flex-direction: row;
}
.container {
  width: 100%;
  padding: 20px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  max-height: 400px;
  overflow-y: scroll;
}

.draggable-item {
  padding: 4px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  cursor: move;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.drag-column {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    padding: 0 10px;
}

.drag-col1{
    width: 100%;
    display: flex;
    flex-direction: row;
    height: 200px;
}
.drag-col2{
    width: 100%;
    display: flex;
    flex-direction: row;
    height: 200px;
}

.dd-button {
  background-color: #EE4E4E;
  color: white;
  border: none;
  padding: 0px 10px;
  font-size: 0.7rem;
  cursor: pointer;
  border-radius: 10px;
}
.dd-button:hover {
  background-color: #f26f6f;
}

.sm\:max-w-lg {
    max-width: 60rem;
}
</style>