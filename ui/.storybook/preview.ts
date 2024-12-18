import { setup } from '@storybook/vue3'
import { UiPlugin } from '../src/installer'
import '../src/scss/style.scss'

setup((app) => {
  app.use(UiPlugin)
})
