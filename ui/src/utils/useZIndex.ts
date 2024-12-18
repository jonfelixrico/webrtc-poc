import { computed, inject, InjectionKey, provide, reactive } from 'vue'

const KEY: InjectionKey<symbol[]> = Symbol('z-index')

export function useZIndexManager() {
  const stack: symbol[] = reactive([])
  provide(KEY, stack)
}

function useModalZIndexBase() {
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

export function useZIndex() {
  const { index, ...actions } = useModalZIndexBase()

  const transformedIndex = computed(() => {
    const val = index.value

    if (val === undefined) {
      return undefined
    }

    return (val + 1) * 5
  })

  return {
    ...actions,
    index: transformedIndex,
  }
}
