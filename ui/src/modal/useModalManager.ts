import { ExtractPropAndEmitTypes, SFComponent } from '@/utils/vue-types'
import { inject, InjectionKey, markRaw, provide, reactive, ref } from 'vue'

interface ModalEntry {
  component: SFComponent
  toBind: ExtractPropAndEmitTypes<SFComponent>
  onContainerMount: () => void
  state: boolean
  setState: (val: boolean) => void
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

      const state = ref(false)
      function setState(value: boolean) {
        if (value || !state.value) {
          return
        }

        state.value = false
        setTimeout(() => {
          modals.delete(id)
        }, 500)
      }

      function onContainerMount() {
        setTimeout(() => {
          state.value = true
        }, 500)
      }

      modals.set(
        id,
        reactive({
          component: markRaw(component),
          toBind: markRaw(options?.toBind ?? {}),
          state,
          setState: markRaw(setState),
          onContainerMount: markRaw(onContainerMount),
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

export function useProgrammaticModalOpen() {
  const actions = inject(ACTIONS_KEY)
  if (!actions) {
    throw new Error('no modal open provided')
  }

  return actions.open
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
