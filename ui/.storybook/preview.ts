import { setup } from '@storybook/vue3'
import { UiPlugin } from '../src/index'
import '../src/scss/style.scss'

setup((app) => {
  app.use(UiPlugin)
})
