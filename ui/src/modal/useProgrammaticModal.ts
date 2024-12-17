import { ExtractPropAndEmitTypes, SFComponent } from '@/utils/vue-types'
import { inject, InjectionKey, provide, reactive, readonly } from 'vue'

interface ModalEntry {
  component: SFComponent
  toBind: ExtractPropAndEmitTypes<SFComponent>
  onHide: () => void
}

export interface ProgrammaticModalActions {
  open<T extends SFComponent>(
    component: T,
    options: {
      toBind?: ExtractPropAndEmitTypes<T>
    },
  ): void
}

const STATE_KEY: InjectionKey<Map<symbol, ModalEntry>> = Symbol(
  'programmatic modal state',
)

const ACTIONS_KEY: InjectionKey<ProgrammaticModalActions> = Symbol(
  'programmatic modal open',
)

export function useProvideProgrammaticModalManager() {
  const modals: Map<symbol, ModalEntry> = reactive(new Map())
  provide(STATE_KEY, modals)

  provide(ACTIONS_KEY, {
    open<T extends SFComponent>(
      component: T,
      options: { toBind?: ExtractPropAndEmitTypes<T> },
    ) {
      const id = Symbol()
      modals.set(id, {
        component,
        toBind: options?.toBind ?? {},
        onHide: () => modals.delete(id),
      })
    },
  })
}

export function useProgrammaticModalOpen() {
  const actions = inject(ACTIONS_KEY)
  if (!actions) {
    throw new Error('no modal open provided')
  }

  return actions.open
}

export function useProgrammaticModalState() {
  const state = inject(STATE_KEY)
  if (!state) {
    throw new Error('no modal state provided')
  }

  return readonly(state)
}
