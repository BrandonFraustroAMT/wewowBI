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
    class="barra"
  >

    <div class="barra-slice">
      <div class="barra-slice__container">
        <div class="barra-slice__column1">
          <div class="barra-slice__logo">
            <PrismicImage :field="slice.primary.logo" />
          </div>
          <h2 class="barra-slice__title">
            <PrismicRichText :field="slice.primary.titulo" />
          </h2>
        </div>
        <div class="barra-slice__column2">
          <div class="barra-slice__text">
            {{ slice.primary.nombreempresa }}
          </div>
          <div class="barra-slice__text">
            {{ slice.primary.correousuario }}
          </div>
          <!-- <div class="barra-slice__logo-empresa">
            <PrismicImage :field="slice.primary.logoempresa" />
          </div> -->
        </div>
        <div class="barra-slice__column3">
          <div class="barra-slice__options">
            {{ slice.primary.labelresultados }}
          </div>
          <div class="barra-slice__reports">
            {{ slice.primary.labelreportes }}
          </div>
        </div>
        <div class="barra-slice__column4">
          <div class="barra-slice__btn">
          </div>
          <div class="barra-slice__btn">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
  .barra {
    width: 15%;
  }
  .barra-slice {
    width: 100%;
    background-color: #F8EDE3;
    height: 100vh;
  }

  .barra-slice__container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .barra-slice__column1 {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 80px;
  }

  .barra-slice__logo {
    width: 40%;
    height: 50px;
    border-radius: 10px;
    background-color: #DFD3C3;
  }

  .barra-slice__title {
    font-size: 1rem;
  }

  .barra-slice__column2 {
    border-bottom: 1px solid #000;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 38px;
  }

  .barra-slice__logo-empresa {
    width: 40%;
    height: 100px;
    margin-top: 30px;
    border-radius: 50%;
    background-color: #DFD3C3;
  }

  .barra-slice__column3 {
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    margin-top: 30px;
    align-items: center;
  }

  .barra-slice__options {
    width: 100%;
    text-transform: uppercase;
    padding: 20px 0;
  }

  .barra-slice__reports {
    width: 100%;
  }

  .barra-slice__column4 {
    margin-top: 100px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .barra-slice__btn {
    margin: 20px 0;
    width: 40%;
    height: 50px;
    border-radius: 10px;
    background-color: #DFD3C3;
  }

</style>