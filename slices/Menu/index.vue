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
    class="menu"
  >
    <div class="menu-slice">
      <div class="menu-slice__container">
        <div class="menu-slice__empresa">
          <div class="menu-slice__empresa-logo">
            <PrismicImage :field="slice.primary.logoempresa" />
          </div>
          <div class="menu-slice__title">
            <PrismicRichText :field="slice.primary.nombreempresa" />
          </div>
        </div>
        
        <div class="menu-slice__text">
          <template v-for="item in slice.primary.groupmenu">
            <PrismicLink :field="item.linklabel" class="menu-slice__link">{{ item.label }}</PrismicLink>
          </template>
        </div>
        <!-- <div class="menu-slice__logo">
          <PrismicImage :field="slice.primary.logo" />
        </div> -->
      </div>
    </div>
  </section>
</template>

<style>
  .menu {
    width: 100%;
  }
  .menu-slice {
    width: 100%;
    background-color: #D0B8A8;
  }

  .menu-slice__container {
    width: 70%;
    height: 80px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    padding: 0 40px;
    align-items: center;
  }

  .menu-slice__empresa {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .menu-slice__empresa-logo {
    width: 100px;
    height: 50px;
    border-radius: 10px;
    margin-right: 10px;
    background-color: #DFD3C3;
  }

  .menu-slice__logo {
    width: 10%;
    height: 50px;
    border-radius: 10px;
    background-color: #DFD3C3;
  }

  .menu-slice__text {
    width: 40%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>