import { inject, InjectionKey, provide, Ref } from 'vue'

interface Values {
  close: () => void
  state: Ref<boolean>
}

const KEY: InjectionKey<Values> = Symbol('programmatic modal state')

export function useProvideModal(state: Values) {
  provide(KEY, state)
}

export function useModalState() {
  const injected = inject(KEY)

  return injected?.state
}

export function useModalActions() {
  const injected = inject(KEY)
  if (!injected) {
    throw new Error()
  }

  const { close } = injected

  return {
    close,
  }
}
