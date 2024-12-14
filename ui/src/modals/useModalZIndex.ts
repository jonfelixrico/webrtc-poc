import {
  computed,
  inject,
  InjectionKey,
  onUnmounted,
  provide,
  reactive,
} from 'vue'

const KEY: InjectionKey<symbol[]> = Symbol('modal z-index')

export function useModalZIndexManager() {
  const stack: symbol[] = reactive([])
  provide(KEY, stack)
}

export function useModalZIndexV2() {
  const stack = inject(KEY)

  const localKey = Symbol()

  const index = computed(() => {
    const idx = stack?.findIndex((item) => localKey === item) ?? -1

    if (idx === -1) {
      return undefined
    }

    return idx
  })

  function activate() {
    if (!stack || stack.includes(localKey)) {
      return
    }

    stack.push(localKey)
  }

  function deactivate() {
    const idx = index.value
    if (!stack || idx === undefined) {
      return
    }

    stack.splice(idx, 1)
  }

  return {
    activate,
    deactivate,
    index,
  }
}

export function useModalZIndex() {
  const { activate, deactivate, index } = useModalZIndexV2()

  activate()
  onUnmounted(deactivate)

  return computed(() => {
    const idx = index.value

    if (idx === undefined) {
      return -1
    }

    return idx + 10
  })
}
