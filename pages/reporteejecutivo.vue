<template>
    <div class="portal">
      <!-- <BarraLateral/> -->
      <div class="menu-column">
        <Menu 
          @applyFilter="handleFilter"
          :empresa="empresa" :mod="mod" :sub="sub" />
        <div>
          <div class="reporte-container">
            <div id="reportContainer" class="reporte"></div>
          </div>
        </div>
      </div>
    </div>
</template>
<script setup lang="ts">

import { useRoute } from '#app';

import { getUrlEmbed } from '~/services/PowerbiService';
import { getEmbedToken } from '~/services/PowerbiService';

const route = useRoute();
const empresa = ref<number>(0);
const mod = ref<number>(0);
const sub = ref<number>(0);
const tokenPayload = ref<any>(null);
const urlEmbed = ref<any>(null);
const tokenEmbed = ref<any>(null);
const filterData = ref({});

const filtroPais:any = ref();
const filtroLocalidad1:any = ref();
const filtroLocalidad2:any = ref();
let powerbiService: any = null;
let powerbi: any = null;

const handleFilter = (filterDataFromMenu) => {
  filterData.value = filterDataFromMenu;
};

watch(() => filterData, async (newFilterData) => {
  filtroPais.value = newFilterData?.pais
  filtroLocalidad1.value = newFilterData?.localidad1
  filtroLocalidad2.value = newFilterData?.localidad2
  await renderReport()
},{ immediate: true });

onMounted(async () => {
  if(typeof window !== 'undefined') {
    const powerbiClient = await import('powerbi-client');
    powerbi = powerbiClient;
      
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
  
    await renderReport();
  }
});

async function renderReport() {
  if (typeof window === 'undefined') return;

  const reportContainer = document.getElementById('reportContainer');
  if (!reportContainer) return;

  // Destruir el reporte anterior si existe
  const existingReport = powerbiService?.get(reportContainer);
  if (existingReport) {
    existingReport.reset();
  }

  try {
    // Obtener la URL y el token para el reporte embebido
    urlEmbed.value = await getUrlEmbed();
    tokenEmbed.value = await getEmbedToken();

    if (urlEmbed.value.data.embedUrl && tokenEmbed.value.data.token) {
      // Construir filtros dinámicos
      let filters = `&filter=DIM_EMPRESAS/ID eq '${empresa.value}'`;

      if (filtroPais.value) {
        filters += ` and EMPRESAS/PAIS eq ${filtroPais.value}`;
      }
      if (filtroLocalidad1.value) {
        filters += ` and Filtro/LOCALIDAD1 eq ${filtroLocalidad1.value}`;
      }
      if (filtroLocalidad2.value) {
        filters += ` and Filtro/LOCALIDAD2 eq ${filtroLocalidad2.value}`;
      }

      // Configurar los detalles del reporte embebido
      const embedConfig = {
        type: 'report',
        embedUrl: `${urlEmbed.value.data.embedUrl}${filters}`,
        accessToken: tokenEmbed.value.data.token,
        tokenType: powerbi.models.TokenType.Embed,
        settings: {
          filterPaneEnabled: false,
          navContentPaneEnabled: true,
          panes: {
            pageNavigation: {
              visible: true,
            },
          },
        },
      };

      // Inicializar Power BI Service si aún no lo has hecho
      if (!powerbiService) {
        powerbiService = new powerbi.service.Service(
          powerbi.factories.hpmFactory,
          powerbi.factories.wpmpFactory,
          powerbi.factories.routerFactory
        );
      }

      // Embeber el nuevo reporte
      powerbiService.embed(reportContainer, embedConfig);
    }
  } catch (error) {
    console.error('Error al obtener el embedUrl o embedToken:', error);
  }
}

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