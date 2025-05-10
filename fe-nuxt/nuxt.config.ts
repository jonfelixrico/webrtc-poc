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

  tailwindcss: {
    config: {
      content: [
        /*
         * We want to include this to tell the FE app's tailwind to also generate the classes
         * for the stuff used in the @webrtcpoc/ui library.
         */
        './node_modules/@webrtcpoc/ui/dist/**',
      ],
    },
  },

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

  eslint: {
    checker: true,
  },

  typescript: {
    typeCheck: true,
  },
})
