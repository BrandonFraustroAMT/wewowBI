<template>
    <div class="portal">
      <BarraLateral/>
      <div class="menu-column">
        <Menu/>
        <div>
          <div>
              <Tabla />
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