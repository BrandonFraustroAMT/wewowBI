<script setup lang="ts">
import { type Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.MenuSlice>([
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
    <PrismicRichText :field="slice.primary.nombreempresa" />
    <PrismicImage :field="slice.primary.logoempresa" />
    <template v-for="item in slice.primary.groupmenu">
      <PrismicLink :field="item.linklabel">{{ item.label }}</PrismicLink>
    </template>
    <PrismicImage :field="slice.primary.logo" />
  </section>
</template>
