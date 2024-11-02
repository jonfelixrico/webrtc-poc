<script setup lang="ts">
import { useDevicesList, useUserMedia } from '@vueuse/core'
import { computed, reactive, toValue, watch } from 'vue'
import { useMediaStreamStore } from '~/store/media-stream.store'
import { useLogger } from '~/composables/logger.composable'
import CDeviceSelectV2 from '~/components/CDeviceSelectV2.vue'

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

const audio = reactive<DeviceValue>({
  id: null,
  enabled: false,
})

const video = reactive<DeviceValue>({
  id: null,
  enabled: false,
})

const constraints = computed<MediaStreamConstraints>(() => {
  const value: MediaStreamConstraints = {}

  if (audio.id && audio.enabled) {
    value.audio = {
      deviceId: audio.id as string,
    }
  }

  if (video.id && video.enabled) {
    value.video = {
      deviceId: video.id as string,
    }
  }

  return value
})

const { stream } = useUserMedia({
  enabled: computed(() => Object.keys(toValue(constraints)).length > 0),
  constraints,
  autoSwitch: true,
})

const msStore = useMediaStreamStore()
watch(stream, (stream) => {
  logger.info(
    'Media stream has changed; video: %s, audio: %s',
    video.id,
    audio.id,
  )
  msStore.mediaStream = stream ?? null
})
</script>

<template>
  <div class="flex flex-row">
    <CDeviceSelectV2
      v-slot="{ deviceId, enabled }"
      v-model="audio.id"
      v-model:enabled="audio.enabled"
      :devices="audioInputs"
    >
      {{ deviceId }}
      {{ enabled }}
    </CDeviceSelectV2>
    <CDeviceSelectV2
      v-slot="{ deviceId, enabled }"
      v-model="video.id"
      v-model:enabled="video.enabled"
      :devices="videoInputs"
    >
      {{ deviceId }}
      {{ enabled }}
    </CDeviceSelectV2>
  </div>
</template>
