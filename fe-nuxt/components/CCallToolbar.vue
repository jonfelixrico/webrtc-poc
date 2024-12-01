<script setup lang="ts">
import { watch } from 'vue'
import { useMediaStreamStore } from '~/store/media-stream.store'
import { useLogger } from '~/composables/logger.composable'
import {
  usePersistedDeviceConfig,
  useUserDevices,
  useUserMediaStream,
} from '~/composables/media.composable'
import CDeviceSelectCamera from './call/CDeviceSelectCamera.vue'
import CDeviceSelectMic from './call/CDeviceSelectMic.vue'

const logger = useLogger()

// TODO best to move this as a composable, and somewhere higher up in the state to signify the importance
const state = usePersistedDeviceConfig(useUserDevices())
const stream = useUserMediaStream(state)
const msStore = useMediaStreamStore()
watch(stream, (stream) => {
  logger.info(
    'Media stream has changed; video: %s, audio: %s',
    state.video.id,
    state.audio.id,
  )
  msStore.mediaStream = stream ?? null
})
</script>

<template>
  <div class="flex flex-row gap-4 justify-center p-4">
    <CDeviceSelectMic />
    <CDeviceSelectCamera />
  </div>
</template>
