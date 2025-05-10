import { UiPlugin } from '@webrtcpoc/ui'
import { defineNuxtPlugin } from '#imports'
export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(UiPlugin)
})
