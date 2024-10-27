import messages from './i18n/messages'

export default defineI18nConfig(() => ({
  legacy: false,

  locale: 'en',
  fallbackLocale: 'en',

  messages,
}))
