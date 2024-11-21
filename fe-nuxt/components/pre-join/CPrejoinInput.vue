<script setup lang="ts">
import { useUserMediaStream } from '#imports'
import { reactive, watch, type PropType } from 'vue'
import CMediaStreamRendererVideo from '~/components/media-stream/CMediaStreamRendererVideo.vue'
import CPreJoinOverlay from '~/components/pre-join/CPreJoinOverlay.vue'
import type { DeviceState } from '~/typings/media.types'

const props = defineProps({
  videoDevices: {
    type: Array as PropType<MediaDeviceInfo[]>,
    required: true,
  },

  audioDevices: {
    type: Array as PropType<MediaDeviceInfo[]>,
    required: true,
  },
})

const video = defineModel('video', {
  type: Object as PropType<DeviceState>,
  default: () => ({
    enabled: false,
    id: null,
  }),
})
watch(
  () => props.videoDevices,
  (newVal, oldVal) => {
    if (!oldVal?.length && newVal.length) {
      video.value = {
        ...video.value,
        id: newVal[0].deviceId,
      }
    }
  },
  {
    once: true,
  },
)

const audio = defineModel('audio', {
  type: Object as PropType<DeviceState>,
  default: () => ({
    enabled: false,
    id: null,
  }),
})
watch(
  () => props.audioDevices,
  (newVal, oldVal) => {
    if (!oldVal?.length && newVal.length) {
      audio.value = {
        ...audio.value,
        id: newVal[0].deviceId,
      }
    }
  },
  {
    once: true,
  },
)

const stream = useUserMediaStream(
  reactive({
    audio,
    video,
  }),
)
</script>

<template>
  <div class="relative">
    <CMediaStreamRendererVideo
      v-if="stream"
      :key="stream.id"
      :media-stream="stream"
    />

    <CPreJoinOverlay
      v-model:audio="audio"
      v-model:video="video"
      class="h-full w-full absolute z-10"
      :audio-devices
      :video-devices
    />
  </div>
</template>
