<script setup lang="ts">
import { useTemplateRef, watch, type PropType } from 'vue'

const props = defineProps({
  mediaStream: {
    type: Object as PropType<MediaStream>,
    required: true,
  },
})

const audioRef = useTemplateRef('audio')

watch(
  [audioRef, () => props.mediaStream],
  ([audioRef, mediaStream]) => {
    if (!audioRef || !mediaStream) {
      return
    }

    audioRef.srcObject = mediaStream
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <audio ref="audio" controls="false" />
</template>
