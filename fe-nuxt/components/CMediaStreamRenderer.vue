<script setup lang="ts">
import { computed, toValue, useTemplateRef, watch, type PropType } from 'vue'

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
  [() => props.mediaStream, divRef],
  ([stream, el]) => {
    if (!el || !stream) {
      return
    }

    el.srcObject = stream
  },
  {
    immediate: true,
  },
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
  <video ref="div" :style="dimsStyle" autoplay :controls="false" />
</template>
