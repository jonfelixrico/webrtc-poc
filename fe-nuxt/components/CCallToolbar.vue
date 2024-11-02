<script setup lang="ts">
import { useDevicesList, useUserMedia } from '@vueuse/core'
import { computed, reactive, ref, toValue, watch, type Ref } from 'vue'
import { useMediaStreamStore } from '~/store/media-stream.store'
import { useLogger } from '~/composables/logger.composable'

const logger = useLogger()
const devices = useDevicesList({
  constraints: {
    audio: true,
    video: true,
  },
  requestPermissions: true,
})

function createMediaDeviceOptions(devices: Ref<MediaDeviceInfo[]>) {
  return computed(() => {
    const value = toValue(devices)

    return [
      {
        label: 'Disabled',
        value: undefined,
      },
      ...value.map(({ label, deviceId }) => ({
        label,
        value: deviceId,
      })),
    ]
  })
}

const audioOptions = createMediaDeviceOptions(devices.audioInputs)
const videoOptions = createMediaDeviceOptions(devices.videoInputs)

const audioId = ref<string>()
const videoId = ref<string>()

const msStore = useMediaStreamStore()
const constraints = reactive<MediaStreamConstraints>({
  audio: reactive({
    deviceId: audioId,
  }),
  video: reactive({
    deviceId: videoId,
  }),
})
const { stream } = useUserMedia({
  enabled: true,
  constraints: constraints,
})
watch(stream, (stream) => {
  logger.info(
    'Media stream has changed; video: %s, audio: %s',
    toValue(videoId),
    toValue(audioId),
  )
  msStore.mediaStream = stream ?? null
})
</script>

<template>
  <div class="flex flex-row">
    <USelect
      v-model="videoId"
      :options="videoOptions"
      option-attribute="label"
      value-attribute="deviceId"
    />
    <USelect
      v-model="audioId"
      :options="audioOptions"
      option-attribute="label"
      value-attribute="deviceId"
    />
  </div>
</template>
