import { ModalPlugin } from '@/modal/useModal'
import { BodyScrollPlugin } from '@/utils/useBodyScroll'
import { ZIndexPlugin } from '@/utils/useZIndex'
import { Plugin } from 'vue'

export const UiPlugin: Plugin = {
  install: (app) => {
    app.use(ZIndexPlugin)
    app.use(BodyScrollPlugin)
    app.use(ModalPlugin)
  },
}
