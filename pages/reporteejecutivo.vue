<template>
    <div class="portal">
      <BarraLateral/>
      <div class="menu-column">
        <Menu/>
        <div>
          <div>
              <h2>Reporte Ejecutivo</h2>
              <iframe title="DEMO 240724" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=700034e8-ed81-40ab-aac5-79a71de98685&autoAuth=true&ctid=87d828aa-c1e2-4c03-9aa3-1691cab514f5" frameborder="0" allowFullScreen="true"></iframe>
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
</style>