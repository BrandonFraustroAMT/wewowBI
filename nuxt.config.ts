import { apiEndpoint, repositoryName } from "./slicemachine.config.json";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["@nuxtjs/prismic",
    '@nuxt/ui'
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