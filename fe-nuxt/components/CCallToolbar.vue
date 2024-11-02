<script setup lang="ts">
import { useDevicesList, useUserMedia } from '@vueuse/core'
import { computed, reactive, toValue, watch } from 'vue'
import { useMediaStreamStore } from '~/store/media-stream.store'
import { useLogger } from '~/composables/logger.composable'
import CDeviceSelect from '~/components/CDeviceSelect.vue'
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-row gap-4 justify-center p-4">
    <CDeviceSelect
      v-slot="{ status }"
      v-model="audio.id"
      v-model:enabled="audio.enabled"
      :devices="audioInputs"
    >
      <div class="flex flex-col items-center">
        <template v-if="status === 'enabled'">
          <UIcon name="i-bi-mic-fill" class="w-7 h-7" />
          {{ t('call.audioControl.mute') }}
        </template>

        <template v-else-if="status === 'disabled'">
          <UIcon name="bi-mic-mute-fill" class="w-7 h-7" />
          {{ t('call.audioControl.unmute') }}
        </template>

        <template v-else-if="status === 'no_device'">
          <UIcon name="bi-mic-mute-fill" class="w-7 h-7" />
          {{ t('call.audioControl.select') }}
        </template>
      </div>
    </CDeviceSelect>

    <CDeviceSelect
      v-slot="{ status }"
      v-model="video.id"
      v-model:enabled="video.enabled"
      :devices="videoInputs"
    >
      <div class="flex flex-col items-center">
        <template v-if="status === 'enabled'">
          <UIcon name="i-tdesign-video-camera" class="w-7 h-7" />
          {{ t('call.videoControl.stop') }}
        </template>

        <template v-else-if="status === 'disabled'">
          <UIcon name="i-tdesign-video-camera-off" class="w-7 h-7" />
          {{ t('call.videoControl.start') }}
        </template>

        <template v-else-if="status === 'no_device'">
          <UIcon name="i-tdesign-video-camera-off" class="w-7 h-7" />
          {{ t('call.videoControl.select') }}
        </template>
      </div>
    </CDeviceSelect>
  </div>
</template>
