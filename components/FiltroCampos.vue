<script setup lang="ts">
import { ref } from 'vue';
import CollapsibleFilter from './CollapsibleFilter.vue';
const selectedRows = ref<string[]>([]);
const selectedColumns = ref<string[]>([]);

const handleSelected = (value: string) => {
  if (!selectedRows.value.includes(value)) {
    selectedRows.value.push(value);
  }
};

const handleDeselected = (value: string) => {
  const index = selectedRows.value.indexOf(value);
  if (index > -1) {
    selectedRows.value.splice(index, 1);
  }
};
</script>

<template>
  <section class="filtro-campos">
    <div class="filtro-campos__container">
        <div class="filtro-campos__row">
            <div class="filtro-campos__title"><h3>Campos</h3></div>
            <div class="filtro-campos__buttons">
                <button class="btn-apply">Aplicar</button>
                <button class="btn-cancel">Cancelar</button>
            </div>
        </div>
        <div class="filtro-campos__text">
            <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit</div>
        </div>
        <div class="filtro-campos__columnas">
            <div class="filtro-campos__column">
                <div class="filtro-campos__col-content1">
                    <span>Campos</span>
                </div>
                <div class="filtro-campos__col-content2">
                    <CollapsibleFilter text="Dimensiones" @selected="handleSelected" @deselected="handleDeselected"/>
                </div>
            </div>
            <div class="filtro-campos__column">
                <div class="filtro-campos__col-content1">
                    <span>Filas</span>
                </div>
                <div class="filtro-campos__col-content2">
                    <div v-for="item in selectedRows" :key="item">
                      {{ item }}
                    </div>
                </div>
            </div>
            <div class="filtro-campos__column">
                <div class="filtro-campos__col-content1">
                    <span>Columnas</span>
                </div>
                <div class="filtro-campos__col-content2">
                    <div v-for="item in selectedColumns" :key="item">
                      {{ item }}
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
        height: auto;
        background-color: #fff;
        box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
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

    .filtro-campos__text {
        width: 100%;
        padding: 0 20px;
    }

    .filtro-campos__columnas {
        width: 100%;
        padding: 30px 20px;
        display: flex;
        flex-direction: row;
    }

    .filtro-campos__column {
        width: 33%;
        height: 300px;
        background-color: #f8f8f8;
        border-radius: 3px;
        margin: 0 10px;
        display: flex;
        flex-direction: column;
    }

    .filtro-campos__col-content1 {
        width: 100%;
        height: 30px;
        background-color: #d3d1d1;
    }

    .filtro-campos__col-content1 span{
        padding-left: 10px;
        font-size: 0.8rem;
    }

    .filtro-campos__col-content2 {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
    }

    /* Style the button that is used to open and close the collapsible content */
    .collapsible {
      background-color: #eee;
      color: #444;
      cursor: pointer;
      padding: 18px;
      width: 100%;
      border: none;
      text-align: left;
      outline: none;
      font-size: 15px;
    }

    /* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
    .active, .collapsible:hover {
      background-color: #ccc;
    }

    /* Style the collapsible content. Note: hidden by default */
    .content {
      padding: 0 18px;
      display: none;
      overflow: hidden;
      background-color: #f1f1f1;
    }
</style>