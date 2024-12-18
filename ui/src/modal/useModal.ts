import { ExtractPropAndEmitTypes, SFComponent } from '@/utils/vue-types'
import { inject, InjectionKey, markRaw, provide, reactive, Ref, ref } from 'vue'

interface ModalEntry {
  component: SFComponent
  toBind: ExtractPropAndEmitTypes<SFComponent>
  model: Ref<boolean>
  delete: () => void
}
type ModalMap = Map<symbol, ModalEntry>

interface ProgrammaticModalActions {
  open<T extends SFComponent>(
    component: T,
    options?: {
      toBind?: ExtractPropAndEmitTypes<T>
    },
  ): void
}

const STATE_KEY: InjectionKey<ModalMap> = Symbol('programmatic modal state')

const ACTIONS_KEY: InjectionKey<ProgrammaticModalActions> = Symbol(
  'programmatic modal open',
)

function useActions(modals: ModalMap) {
  const actions = {
    open<T extends SFComponent>(
      component: T,
      options?: { toBind?: ExtractPropAndEmitTypes<T> },
    ) {
      const id = Symbol()

      function deleteEntry() {
        modals.delete(id)
      }

      modals.set(
        id,
        markRaw({
          component,
          toBind: options?.toBind ?? {},
          model: ref(false),
          delete: deleteEntry,
        }),
      )
    },
  }

  return actions
}

export function useProvideModalManager() {
  const modals: ModalMap = reactive(new Map())
  provide(STATE_KEY, modals)
  provide(ACTIONS_KEY, useActions(modals))
}

export function useModalActions() {
  const actions = inject(ACTIONS_KEY)
  if (!actions) {
    throw new Error('no modal open provided')
  }

  return actions
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
