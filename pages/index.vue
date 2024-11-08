<template>
  <!-- <div v-if="isAuthenticated"> -->
  <div>
    <div class="portal">
      <div class="menu-column">
        <Menu :empresa="empresa" :mod="mod" :sub="sub" />
        <div class="image-container">
          <img src="assets/img/wewowatworklogo.png" alt="insignia">
        </div>
      </div>
    </div>
  </div>
  <!-- <div v-else>
    <p>Acceso denegado. No estás autenticado.</p>
  </div> -->
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useRoute } from '#app';

const empresa = ref(0);
const mod = ref(0);
const sub = ref(0);
const tokenPayload = ref<any>(null);

onMounted(() => {
  const route = useRoute();

  // Decodificar el token en Base64
  const token = route.query.token as string;
  if (token) {
    try {
      // Verificar si el token necesita padding
      const decodedToken = decodeBase64UrlSafe(token);

      // Tratar de decodificar como UTF-16 y luego convertir a JSON
      tokenPayload.value = parseTokenAsUtf16(decodedToken);
      console.log('token',tokenPayload)

      empresa.value = tokenPayload.value.empresa ? Number(tokenPayload.value.empresa) : null;
      mod.value = tokenPayload.value.modid ? Number(tokenPayload.value.modid) : null;
      sub.value = tokenPayload.value.subid ? Number(tokenPayload.value.subid) : null;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  }
});

// Función para decodificar Base64 URL-Safe
function decodeBase64UrlSafe(base64String: string) {
  // Reemplaza los caracteres que cambian en las URLs
  const base64 = base64String.replace(/-/g, '+').replace(/_/g, '/');
  return atob(base64);
}

// Función para convertir UTF-16 a cadena legible
function parseTokenAsUtf16(decodedString: string) {
  let result = '';
  for (let i = 0; i < decodedString.length; i += 2) {
    // Obtiene dos bytes a la vez (UTF-16 usa 2 bytes por carácter)
    const code = decodedString.charCodeAt(i) + (decodedString.charCodeAt(i + 1) << 8);
    result += String.fromCharCode(code);
  }
  return JSON.parse(result); // Intenta convertir la cadena a un objeto JSON
}
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

.image-container {
  width: 100%;
  height: 500px;
}
.image-container img{
  width: 100%;
  height: 100%;
}
</style>
