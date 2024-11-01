// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    ['@pinia/nuxt', { disableVuex: true }],
    '@vueuse/nuxt',
  ],

  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
      },
    ],

    defaultLocale: 'en',

    vueI18n: './i18n.config.ts',
  },

  components: [],

  nitro: {
    experimental: {
      websocket: true,
    },

    routeRules: {
      // TODO add only during dev
      '/be/**': {
        proxy: 'http://localhost:3050/**',
      },
    },
  },

  imports: {
    autoImport: false,
  },
})
