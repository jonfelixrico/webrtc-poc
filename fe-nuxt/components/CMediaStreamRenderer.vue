<script setup lang="ts">
import { computed, useTemplateRef, watch, type PropType } from 'vue'

const props = defineProps({
  mediaStream: {
    type: Object as PropType<MediaStream>,
    required: true,
  },

  width: {
    type: Number,
    required: true,
  },

  height: {
    type: Number,
    required: true,
  },

  muteAudio: Boolean,
})

const divRef = useTemplateRef('div')
watch(
  [() => props.mediaStream, divRef],
  ([stream, el]) => {
    if (!el || !stream) {
      return
    }

    el.srcObject = stream
    el.play()
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <video
    ref="div"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
    }"
    autoplay
    :controls="false"
    :playsinline="true"
    :muted="muteAudio"
  />
</template>
