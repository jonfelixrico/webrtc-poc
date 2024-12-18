import {
  inject,
  InjectionKey,
  onBeforeUnmount,
  Plugin,
  reactive,
  watch,
} from 'vue'

const KEY: InjectionKey<Set<symbol>> = Symbol('body scroll')

const OVERFLOW_HIDDEN = 'overflow-hidden'

export function useBodyScrollActions() {
  const references = inject(KEY)

  const localKey = Symbol()

  function hide() {
    references?.add(localKey)
  }

  function show() {
    references?.delete(localKey)
  }

  onBeforeUnmount(show)

  return {
    hide,
    show,
  }
}

/**
 * @private
 */
export const BodyScrollPlugin: Plugin = {
  install: (app) => {
    const references = reactive(new Set<symbol>())
    app.provide(KEY, references)

    watch(
      () => references.size,
      (size) => {
        if (size) {
          document.body.classList.add(OVERFLOW_HIDDEN)
          console.debug('Activated body overflow-hidden')
        } else {
          document.body.classList.remove(OVERFLOW_HIDDEN)
          console.debug('Deactivated body overflow-hidden')
        }
      },
      {
        immediate: true,
      },
    )
  },
}
