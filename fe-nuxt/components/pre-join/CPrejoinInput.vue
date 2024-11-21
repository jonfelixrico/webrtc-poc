<script setup lang="ts">
import { useUserMediaStream } from '#imports'
import { useDevicesList } from '@vueuse/core'
import { reactive, watch } from 'vue'
import CMediaStreamRendererVideo from '~/components/media-stream/CMediaStreamRendererVideo.vue'
import CPreJoinOverlay from '~/components/pre-join/CPreJoinOverlay.vue'
import type { DeviceState } from '~/typings/media.types'

const { audioInputs, videoInputs } = useDevicesList({
  constraints: {
    audio: true,
    video: true,
  },
})

const video = reactive<DeviceState>({
  id: null,
  enabled: false,
})
watch(
  videoInputs,
  (newVal, oldVal) => {
    if (!oldVal?.length && newVal.length) {
      video.id = newVal[0].deviceId
    }
  },
  {
    once: true,
  },
)

const audio = reactive<DeviceState>({
  id: null,
  enabled: false,
})
watch(
  audioInputs,
  (newVal, oldVal) => {
    if (!oldVal?.length && newVal.length) {
      audio.id = newVal[0].deviceId
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
      :audio-devices="audioInputs"
      :video-devices="videoInputs"
    />
  </div>
</template>
