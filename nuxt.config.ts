import { apiEndpoint, repositoryName } from "./slicemachine.config.json";
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  build: {
    transpile: ['vuetify'],
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/prismic",
    '@nuxt/ui',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  css: [
    '@/assets/css/reset.css',
  ],
  prismic: {
    endpoint: apiEndpoint || repositoryName,
    linkResolver: '@/plugins/link-resolver.js',
    htmlSerializer: '@/plugins/html-serializer.js',
  }
})