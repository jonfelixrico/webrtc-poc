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

export function useModalZIndex() {
  const stack = inject(KEY)

  const localKey = Symbol()
  stack?.push(localKey)

  const realIndex = computed(() => {
    return stack?.findIndex((item) => localKey === item) ?? -1
  })

  onUnmounted(() => {
    const idx = realIndex.value
    if (!stack || idx === -1) {
      return
    }

    stack.splice(idx, 1)
  })

  return computed(() => {
    if (realIndex.value === -1) {
      return -1
    }

    return realIndex.value + 10
  })
}
