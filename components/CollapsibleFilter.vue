<template>
  <div>
    <button type="button" class="collapsible" @click="toggleContent">{{ text }}</button>
    <div class="content" :style="{ display: isContentVisible ? 'block' : 'none' }">
      <div class="listcheck">
        <label v-for="(item, index) in items" :key="index">
          <input type="checkbox" :id="'cbox' + index" :value="item" @change="updateSelection($event)" /> 
          {{ item }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['selected', 'deselected']);

const isContentVisible = ref(false);
const toggleContent = () => {
  isContentVisible.value = !isContentVisible.value;
};

const updateSelection = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.checked) {

    emit('selected', target.value);
  } else {
    emit('deselected', target.value);
  }
};
</script>

<style>
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
      font-size: 0.8rem;
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
    .listcheck {
        display: flex;
        flex-direction: column;
    }
    .listcheck label{
        margin: 10px 0;
        font-size: 0.8rem;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
</style>