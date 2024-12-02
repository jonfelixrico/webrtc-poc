<script setup lang="ts">
import { watch } from 'vue'
import { useMediaStreamStore } from '~/store/media-stream.store'
import { useLogger } from '~/composables/logger.composable'
import {
  usePersistedDeviceConfig,
  useUserDevices,
  useUserMediaStream,
} from '~/composables/media.composable'
import CDeviceSelectCamera from './CDeviceSelectCamera.vue'
import CDeviceSelectMic from './CDeviceSelectMic.vue'
import CParticipantsListButton from '~/components/call/CParticipantsList.vue'

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
  <div class="grid grid-cols-3 gap-x-4 items-center">
    <div class="flex flex-row gap-x-4 items-center">
      <CDeviceSelectMic />
      <CDeviceSelectCamera />
    </div>

    <div class="flex flex-row justify-center">
      <CParticipantsListButton />
    </div>
  </div>
</template>
