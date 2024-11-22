import { useWindowSize } from '@vueuse/core'
import { computed, reactive, readonly } from 'vue'

const BP_SM = 640
const BP_MD = 768
const BP_LG = 1024
const BP_XL = 1280
const BP_2XL = 1536

export function useScreen() {
  const { width } = useWindowSize()

  function checkEqual(toCheck: number) {
    return computed(() => width.value === toCheck)
  }

  function checkLt(toCheck: number) {
    return computed(() => width.value < toCheck)
  }

  function checkGt(toCheck: number) {
    return computed(() => width.value > toCheck)
  }

  const lt = reactive({
    sm: checkLt(BP_SM),
    md: checkLt(BP_MD),
    lg: checkLt(BP_LG),
    xl: checkLt(BP_XL),
    '2xl': checkLt(BP_2XL),
  })

  const gt = reactive({
    sm: checkGt(BP_SM),
    md: checkGt(BP_MD),
    lg: checkGt(BP_LG),
    xl: checkGt(BP_XL),
    '2xl': checkGt(BP_2XL),
  })

  return readonly(
    reactive({
      sm: checkEqual(BP_SM),
      md: checkEqual(BP_MD),
      lg: checkEqual(BP_LG),
      xl: checkEqual(BP_XL),
      '2xl': checkEqual(BP_2XL),

      lt,
      gt,
    }),
  )
}
