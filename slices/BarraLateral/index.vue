<script setup lang="ts">
import { type Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.BarraLateralSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ]),
);
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <PrismicRichText :field="slice.primary.titulo" />
    <PrismicImage :field="slice.primary.logo" />
    {{ slice.primary.nombreempresa }}
    {{ slice.primary.correousuario }}
    <PrismicImage :field="slice.primary.logoempresa" />

    {{ slice.primary.labelaplicaciones }}
    <template v-for="item in slice.primary.groupaplicaciones">
      <PrismicImage :field="item.icono" />
      {{ item.label }}
    </template>

    {{ slice.primary.labelherramientas }}
    <template v-for="item in slice.primary.groupherramientas">
      <PrismicImage :field="item.icono" />
      {{ item.label }}
    </template>

    {{ slice.primary.labelresultados }}
    {{ slice.primary.labelreportes }}
  </section>
</template>
