<script setup lang="ts">
import { useTemplateRef, watch, type PropType } from 'vue'

const props = defineProps({
  /**
   * If the parent wishes to change mediaStream, then they have to do it in a different
   * instance of this component, e.g. unmount then mount a new component.
   *
   * This component is intentionally limited to support a single `mediaStream` instance
   * throughout its lifetime to keep it simple.
   */
  mediaStream: {
    type: Object as PropType<MediaStream>,
    required: true,
  },
})

const audioRef = useTemplateRef('audio')

watch(
  audioRef,
  (audioRef) => {
    if (!audioRef) {
      return
    }

    audioRef.srcObject = props.mediaStream
    audioRef.play()
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <audio ref="audio" controls="false" />
</template>
