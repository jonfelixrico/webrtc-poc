<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { reactive, useTemplateRef } from 'vue'

const dimensions = reactive({
  width: 0,
  height: 0,
})

const divRef = useTemplateRef('div')
useResizeObserver(divRef, (entries) => {
  const [entry] = entries ?? []
  if (!entry) {
    return
  }

  const { width, height } = entry.contentRect
  dimensions.width = width
  dimensions.height = height
})
</script>

<template>
  <div ref="div">
    <slot :width="dimensions.width" :height="dimensions.height" />
  </div>
</template>
