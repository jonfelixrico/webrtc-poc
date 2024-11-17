<script setup lang="ts">
import { useResizeObserverValue } from '~/composables/vueuse-extensions.composables'
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

const videoRef = useTemplateRef('video')

watch(
  videoRef,
  (ref) => {
    if (!ref) {
      return
    }

    ref.srcObject = props.mediaStream
    ref.play()
  },
  {
    immediate: true,
  },
)

const containerRef = useTemplateRef('container')
const dimensions = useResizeObserverValue(containerRef)
</script>

<template>
  <div ref="container" class="relative h-full w-full">
    <video
      ref="video"
      class="absolute"
      :style="{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
      }"
      :controls="false"
      :playsinline="true"
      muted
    />
  </div>
</template>
