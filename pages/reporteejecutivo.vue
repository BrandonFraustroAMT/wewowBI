<template>
    <div class="portal">
      <!-- <BarraLateral/> -->
      <div class="menu-column">
        <Menu :empresa="empresa" :mod="mod" :sub="sub" />
        <div>
          <!-- <div class="reporte-container">
              <iframe title="DEMO 240816" class="reporte" src="https://app.powerbi.com/view?r=eyJrIjoiNTgxZjNiZjctMjRiZi00NmVlLTkxZGEtOGNlZThlYzA0ZDhiIiwidCI6IjgxMzdjMTE5LWI0NmMtNDE4YS04OTE0LTY4MzM0NjNlZWViMCJ9" frameborder="0" allowFullScreen="true"></iframe>
          </div> -->
          <div class="reporte-container">
            <div id="reportContainer" class="reporte"></div> <!-- Contenedor para el reporte -->
          </div>
        </div>
      </div>
    </div>
</template>
<script setup lang="ts">

import { useRoute } from '#app';
import * as powerbi from 'powerbi-client';

import { getUrlEmbed } from '~/services/PowerbiService';
import { getEmbedToken } from '~/services/PowerbiService';

const route = useRoute();
const empresa = ref<number>(0);
const mod = ref<number>(0);
const sub = ref<number>(0);
const tokenPayload = ref<any>(null);
const urlEmbed = ref<any>(null);
const tokenEmbed = ref<any>(null);


onMounted(async () => {
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

  if (typeof window !== 'undefined') {
    try {
      // Obtener la URL y el token para el reporte embebido
      urlEmbed.value = await getUrlEmbed();
      tokenEmbed.value = await getEmbedToken();

      // Llamadas exitosas, ahora configurar el reporte con Power BI SDK
      if (urlEmbed.value.data.embedUrl && tokenEmbed.value.data.token) {
        // Inicializar el contenedor del reporte
        const reportContainer = document.getElementById("reportContainer");

        if (reportContainer) {
          // Configurar los detalles del reporte embebido
          const embedConfig = {
            type: 'report', // Tipo de contenido embebido 
            embedUrl: `${urlEmbed.value.data.embedUrl}&filter=EMPRESAS/EMPID eq ${empresa.value}`,
            accessToken: tokenEmbed.value.data.token,
            tokenType: powerbi.models.TokenType.Embed,
            settings: {
              filterPaneEnabled: false,
              navContentPaneEnabled: true,
              panes: {
                pageNavigation: {
                  visible: true,
                }
              }
            }
          };

          // Inicializar Power BI
          const powerbiService = new powerbi.service.Service(
            powerbi.factories.hpmFactory,
            powerbi.factories.wpmpFactory,
            powerbi.factories.routerFactory
          );

          // Embeber el reporte dentro del contenedor
          powerbiService.embed(reportContainer, embedConfig);
        }
      }
    } catch (error) {
      console.error("Error al obtener el embedUrl o embedToken:", error);
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