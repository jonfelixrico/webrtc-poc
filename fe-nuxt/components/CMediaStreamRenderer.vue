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

const hasVideo = computed(() => props.mediaStream?.getVideoTracks()?.length > 0)

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

const dimsStyle = computed(() => {
  const { width, height } = props

  return {
    width: `${width}px`,
    height: `${height}px`,
  }
})
</script>

<template>
  <video
    v-show="hasVideo"
    ref="div"
    :style="dimsStyle"
    autoplay
    :controls="false"
    :playsinline="true"
    :muted="muteAudio"
  />

  <!--
    hasVideo being off means that the stream is audio-only.
    This assumes that if hasVideo is off, then there must be at least audio for this
    media stream to exist.
  -->
  <slot v-if="!hasVideo" name="audio-only" />
</template>
