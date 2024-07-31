<script setup lang="ts">
  import empresasService from '~/services/Empresas';
  

  const empresas = async () => {
    try {
      const data = await empresasService.getEmpresas();
      console.log("Data tabla", data);
    } catch(err) {
      console.log("Error tabla: ", err);
    }
  }

  empresas();

</script>
<template>
  <section class="tabla">
    <div class="tabla-container">
      <div class="tabla-container__scroll">
        <table>
          <caption>Empresa</caption>
          <tr>
            <th></th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>6</th>
            <th>7</th>
            <th>8</th>
            <th>9</th>
            <th>10</th>
          </tr>
          <tr>

          </tr>
          <tr>
            <td>Demográficos</td>
            <td>Data</td>
            <td>Data</td>
          </tr>
        </table>
      </div>
    </div>
  </section>
</template>

<style>
  .tabla {
    width: 100%;
  }
  .tabla-container__scroll {
    max-width: 100%;
    max-height: 500px; 
    overflow-x: auto;
    overflow-y: auto;
  }
</style>