<script setup lang="ts">
import { useDevicesList, useUserMedia } from '@vueuse/core'
import { computed, reactive, watch } from 'vue'
import { useMediaStreamStore } from '~/store/media-stream.store'
import { useLogger } from '~/composables/logger.composable'
import CDeviceSelect from '~/components/CDeviceSelect.vue'

const logger = useLogger()
const { audioInputs, videoInputs } = useDevicesList({
  constraints: {
    audio: true,
    video: true,
  },
  requestPermissions: true,
})

interface DeviceValue {
  id: string | null
  enabled: boolean
}

const audioV = reactive<DeviceValue>({
  id: null,
  enabled: false,
})

const videoV = reactive<DeviceValue>({
  id: null,
  enabled: false,
})

const msStore = useMediaStreamStore()
const constraints = reactive<MediaStreamConstraints>({
  audio: reactive({
    deviceId: computed(() => audioV.id ?? undefined),
  }),
  video: reactive({
    deviceId: computed(() => videoV.id ?? undefined),
  }),
})
const { stream } = useUserMedia({
  enabled: true,
  constraints: constraints,
})
watch(stream, (stream) => {
  logger.info(
    'Media stream has changed; video: %s, audio: %s',
    videoV.id,
    audioV.id,
  )
  msStore.mediaStream = stream ?? null
})
</script>

<template>
  <div class="flex flex-row">
    <CDeviceSelect
      v-model="audioV.id"
      v-model:enabled="audioV.enabled"
      :devices="audioInputs"
    />
    <CDeviceSelect
      v-model="videoV.id"
      v-model:enabled="videoV.enabled"
      :devices="videoInputs"
    />
  </div>
</template>
