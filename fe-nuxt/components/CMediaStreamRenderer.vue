<script setup lang="ts">
import { computed, PropType, toValue, useTemplateRef, watch } from 'vue'

const props = defineProps({
  mediaStream: {
    type: Object as PropType<MediaStream>,
  },

  width: {
    type: Number,
    required: true,
  },

  height: {
    type: Number,
    required: true,
  },
})

const divRef = useTemplateRef('div')
watch(
  () => props.mediaStream,
  (stream) => {
    const el = toValue(divRef)

    if (!el || !stream) {
      return
    }

    el.srcObject = stream
  }
)

const dimsStyle = computed(() => {
  const { width, height } = props

  return {
    width: `${width}px`,
    height: `${height}px`,
  }
})
</script>

<template>
  <video ref="div" :style="dimsStyle" />
</template>
