<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { computed, reactive, ref, toValue, useTemplateRef } from 'vue'

const width = ref(0)
const height = computed(() => toValue(width) * 0.5)
const dimensions = reactive({
  width,
  height,
})

const divRef = useTemplateRef('div')
useResizeObserver(divRef, (entries) => {
  const [entry] = entries ?? []
  if (!entry) {
    return
  }

  width.value = entry.contentRect.width
})
</script>

<template>
  <div ref="div" :style="{ height: `${height}px` }">
    <slot :width="dimensions.width" :height="dimensions.height" />
  </div>
</template>
