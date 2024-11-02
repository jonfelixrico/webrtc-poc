import { useResizeObserver, type MaybeComputedElementRef } from '@vueuse/core'
import { reactive } from 'vue'

export function useResizeObserverValue(ref: MaybeComputedElementRef) {
  const dimensions = reactive({
    width: 0,
    height: 0,
  })

  useResizeObserver(ref, (entries) => {
    const [entry] = entries
    if (!entry) {
      return
    }

    const { width, height } = entry.contentRect
    dimensions.width = width
    dimensions.height = height
  })

  return dimensions
}
