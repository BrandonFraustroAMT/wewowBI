<template>
    <div class="portal">
      <!-- <BarraLateral/> -->
      <div class="menu-column">
        <Menu :empresa="empresa" :mod="mod" :sub="sub" />
        <div>
          <div class="reporte-container">
              <iframe title="DEMO 240816" class="reporte" src="https://app.powerbi.com/view?r=eyJrIjoiNTgxZjNiZjctMjRiZi00NmVlLTkxZGEtOGNlZThlYzA0ZDhiIiwidCI6IjgxMzdjMTE5LWI0NmMtNDE4YS04OTE0LTY4MzM0NjNlZWViMCJ9" frameborder="0" allowFullScreen="true"></iframe>
              
          </div>
        </div>
      </div>
    </div>
</template>
<script setup lang="ts">

import { useRoute } from '#app';

const route = useRoute();
const empresa = ref<number>(0);
const mod = ref<number>(0);
const sub = ref<number>(0);
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

.reporte-container {
  margin: 20px;
}

.reporte {
  width: 100%;
  height: 70vh;
}
</style>