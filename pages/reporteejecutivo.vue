<template>
    <div class="portal">
      <!-- <BarraLateral/> -->
      <div class="menu-column">
        <Menu/>
        <div>
          <div class="reporte-container">
              <h2>Reporte Ejecutivo</h2>
              <iframe title="DEMO 240816" class="reporte" src="https://app.powerbi.com/view?r=eyJrIjoiY2U1MjA0OWEtNTRmMS00MDdhLWFlMDUtMGMwNzhiYjM2NDg0IiwidCI6IjgxMzdjMTE5LWI0NmMtNDE4YS04OTE0LTY4MzM0NjNlZWViMCJ9" frameborder="0" allowFullScreen="true"></iframe>
          </div>
        </div>
      </div>
    </div>
</template>

<style>
.portal {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.menu-column {
  width: 100%;
}

.reporte-container {
  margin: 20px;
}

.reporte {
  width: 100%;
  height: 70vh;
}
</style>