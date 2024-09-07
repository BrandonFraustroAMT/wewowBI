<template>
  <!-- <div v-if="isAuthenticated"> -->
  <div>
    <div class="portal">
      <div class="menu-column">
        <Menu :empresa="empresa" :mod="mod" :sub="sub"/>
        <h2>Portada</h2>
      </div>
    </div>
  </div>
  <!-- <div v-else>
    <p>Acceso denegado. No estás autenticado.</p>
  </div> -->
</template>

<script setup="ts">

import { onMounted, ref } from 'vue';
import { useRoute } from '#app';
import { validateToken } from '~/services/Validatetoken';

const route = useRoute();
const empresa = ref(0);
const mod = ref(0);
const sub = ref(0);
/* const isAuthenticated = ref(false); */

onMounted(() => {
  const empresaId = route.query.empresa ? Number(route.query.empresa) : null;
  const modid = route.query.modid ? Number(route.query.modid) : null;
  const subid = route.query.subid ? Number(route.query.subid) : null;
  empresa.value = isNaN(empresaId) ? null : empresaId;
  mod.value = isNaN(modid) ? null : empresaId;
  sub.value = isNaN(subid) ? null : empresaId;
});

/* 

https://sitio.com/portada?empresa=2&token=eyJhbGc...


onMounted(async () => {
  const empresaId = route.query.empresa ? Number(route.query.empresa) : null;
  empresa.value = isNaN(empresaId) ? null : empresaId;

  // Extrae el token de la URL
  const token = route.query.token as string;

  if (token) {
    // Valida el token
    isAuthenticated.value = await validateToken(token);

    if (!isAuthenticated.value) {
      // Redirige al usuario a una página de acceso denegado o login si el token no es válido
      router.push('/login');
    }
  } else {
    // Redirige al usuario a una página de acceso denegado o login si no hay token
    router.push('/login');
  }
})
*/
</script>

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
