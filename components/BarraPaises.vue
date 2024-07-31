<template>
  <section class="paises">
    <div class="paises-container">
      <div class="paises-container__image">
      </div>
    </div>
  </section>
</template>

<style>
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