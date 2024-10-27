// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/i18n'],

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

  components: [
    {
      /*
       * We're opting out from the directory-based component name mechanism of Nuxt
       * since if this ever turns into a big enough project, looking for a component can
       * turn into searching hell.
       *
       * Also, this feature tightly couples are names to the dir. We don't have much freedom
       * with our naming scheme.
       */
      path: '~/components',
      pathPrefix: false,
    },
  ],
})
