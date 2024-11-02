<script setup lang="ts">
import { useResizeObserverValue } from '~/composables/vueuse-extensions.composables'
import { computed, toValue, useTemplateRef } from 'vue'

const divRef = useTemplateRef('div')
const dimensions = useResizeObserverValue(divRef)

const width = computed(() => dimensions.width)
const height = computed(() => toValue(width) * 0.5)
</script>

<template>
  <div ref="div" :style="{ height: `${height}px` }">
    <slot :width :height />
  </div>
</template>
