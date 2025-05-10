import type { BindTypes } from '@/utils/vue-types'
import {
  inject,
  InjectionKey,
  markRaw,
  reactive,
  Ref,
  ref,
  Plugin,
  Component,
} from 'vue'

interface ModalEntry {
  component: Component
  toBind: Record<string, unknown>
  model: Ref<boolean>
  delete: () => void
}
type ModalMap = Map<symbol, ModalEntry>

const STATE_KEY: InjectionKey<ModalMap> = Symbol('programmatic modal state')

function useOpen(modals: ModalMap) {
  function open<T extends Component>(
    component: T,
    options?: { toBind?: BindTypes<T> },
  ) {
    const id = Symbol()

    function deleteEntry() {
      modals.delete(id)
    }

    const model = ref(false)

    modals.set(
      id,
      markRaw({
        component,
        toBind: options?.toBind ?? {},
        model,
        delete: deleteEntry,
      }),
    )

    return {
      close: () => {
        model.value = false
      },
    }
  }

  return open
}

export function useModalActions() {
  const state = inject(STATE_KEY)
  if (!state) {
    throw new Error('no modal open provided')
  }

  const open = useOpen(state)
  return {
    open,
  }
}

/**
 * @private
 */
export function useProvideModalManagerState() {
  const state = inject(STATE_KEY)
  if (!state) {
    throw new Error('no modal state provided')
  }

  return state
}

/**
 * @private
 */
export const ModalPlugin: Plugin = {
  install: (app) => {
    app.provide(STATE_KEY, reactive(new Map()))
  },
}
