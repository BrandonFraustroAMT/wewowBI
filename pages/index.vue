<template>
  <div>
    <div class="portal">
      <BarraLateral/>
      <div class="menu-column">
        <Menu/>
        <BarraPaises />
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--backgroundBlack);
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid #007bff;
  border-top-color: transparent;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.portal {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.menu-column {
  width: 100%;
}

</style>
