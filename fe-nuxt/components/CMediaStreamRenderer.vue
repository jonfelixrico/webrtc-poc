<script setup lang="ts">
import { useResizeObserverValue } from '#imports'
import { computed, useTemplateRef, watch, type PropType } from 'vue'

const props = defineProps({
  mediaStream: {
    type: Object as PropType<MediaStream>,
    required: true,
  },

  muteAudio: Boolean,
})

const hasVideo = computed(() => props.mediaStream?.getVideoTracks()?.length > 0)

const videoRef = useTemplateRef('video')
watch(
  [() => props.mediaStream, videoRef],
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

const containerRef = useTemplateRef('container')
const dimensions = useResizeObserverValue(containerRef)
</script>

<template>
  <div>
    <div v-show="hasVideo" ref="container" class="relative h-full w-full">
      <video
        ref="video"
        class="absolute"
        :style="{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }"
        autoplay
        :controls="false"
        :playsinline="true"
        :muted="muteAudio"
      />
    </div>

    <!--
      hasVideo being off means that the stream is audio-only.
      This assumes that if hasVideo is off, then there must be at least audio for this
      media stream to exist.
    -->
    <slot v-if="!hasVideo" name="audio-only">
      <div class="bg-black h-full w-full" />
    </slot>
  </div>
</template>
