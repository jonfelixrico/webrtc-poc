import { ExtractPropAndEmitTypes, SFComponent } from '@/utils/vue-types'
import { inject, InjectionKey, provide } from 'vue'

export interface ModalOpenActions {
  open<T extends SFComponent>(
    component: T,
    options: {
      toBind?: ExtractPropAndEmitTypes<T>
    },
  ): void
}

const INJECTION_KEY: InjectionKey<ModalOpenActions> = Symbol('modal open')

export function useProvideModalOpen(actions: ModalOpenActions) {
  provide(INJECTION_KEY, actions)
}

export function useModalOpen() {
  const provided = inject(INJECTION_KEY)
  if (!provided) {
    throw new Error('no modal open provided')
  }

  return provided
}
