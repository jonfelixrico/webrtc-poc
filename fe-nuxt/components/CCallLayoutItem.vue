<script setup lang="ts">
import { useResizeObserverValue } from '~/composables/vueuse-extensions.composables'
import { computed, useTemplateRef } from 'vue'

const divRef = useTemplateRef('div')
const dimensions = useResizeObserverValue(divRef)

const width = computed(() => dimensions.width)
const height = computed(() => width.value * 0.5)
</script>

<template>
  <div ref="div" :style="{ height: `${height}px` }">
    <slot :width :height />
  </div>
</template>
