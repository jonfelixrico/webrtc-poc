import { inject, InjectionKey, provide } from 'vue'

export interface ModalControls {
  close: () => void
}
const INJECTION_KEY: InjectionKey<ModalControls> = Symbol('modal control')

export function useModalControl() {
  const controls = inject(INJECTION_KEY)

  if (!controls) {
    throw new Error('none provided')
  }

  return controls
}

export function useProvideModalControl(controls: ModalControls) {
  provide(INJECTION_KEY, controls)
}
