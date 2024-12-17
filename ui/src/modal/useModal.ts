import { inject, InjectionKey, provide, Ref } from 'vue'

interface Values {
  close: () => void
  state: Ref<boolean>
}

const INJECTION_KEY: InjectionKey<Values> = Symbol('programmatic modal state')

/**
 * @private
 */
export function useProvideModal(state: Values) {
  provide(INJECTION_KEY, state)
}

/**
 * @private
 */
export function useModalState() {
  const injected = inject(INJECTION_KEY)

  return injected?.state
}

export function useModalActions() {
  const injected = inject(INJECTION_KEY)
  if (!injected) {
    throw new Error()
  }

  const { close } = injected

  return {
    close,
  }
}
