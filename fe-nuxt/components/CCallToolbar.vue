<script setup lang="ts">
import { useDevicesList } from '@vueuse/core'
import { computed, reactive, watch } from 'vue'
import { useMediaStreamStore } from '~/store/media-stream.store'
import { useLogger } from '~/composables/logger.composable'
import CDeviceSelect from '~/components/call/CDeviceSelect.vue'
import { useI18n } from 'vue-i18n'
import {
  usePersistedDeviceConfig,
  useUserMediaStream,
} from '~/composables/media.composable'

const logger = useLogger()
const { audioInputs, videoInputs } = useDevicesList({
  constraints: {
    audio: true,
    video: true,
  },
  requestPermissions: true,
})

const state = usePersistedDeviceConfig({
  audio: audioInputs,
  video: videoInputs,
})
const audio = computed({
  get: () => state.audio,
  set: ({ enabled, id }) => {
    // cant reassign state.audio; it breaks the linked refs within usePersistentDeviceConfig
    state.audio.id = id
    state.audio.enabled = enabled
  },
})
const video = computed({
  get: () => state.video,
  set: ({ enabled, id }) => {
    state.video.enabled = enabled
    state.video.id = id
  },
})

const stream = useUserMediaStream(
  reactive({
    audio,
    video,
  }),
)

const msStore = useMediaStreamStore()
watch(stream, (stream) => {
  logger.info(
    'Media stream has changed; video: %s, audio: %s',
    video.value.id,
    audio.value.id,
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
          <UIcon name="i-ri-mic-fill" class="icon-size" />
          {{ t('call.audioControl.mute') }}
        </template>

        <template v-else-if="status === 'disabled'">
          <UIcon name="i-ri-mic-off-fill" class="icon-size" />
          {{ t('call.audioControl.unmute') }}
        </template>

        <template v-else-if="status === 'no_device'">
          <UIcon name="i-ri-mic-line" class="icon-size" />
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
          <UIcon name="i-ri-video-on-fill" class="icon-size" />
          {{ t('call.videoControl.stop') }}
        </template>

        <template v-else-if="status === 'disabled'">
          <UIcon name="i-ri-video-off-fill" class="icon-size" />
          {{ t('call.videoControl.start') }}
        </template>

        <template v-else-if="status === 'no_device'">
          <UIcon name="i-ri-video-on-line" class="icon-size" />
          {{ t('call.videoControl.select') }}
        </template>
      </div>
    </CDeviceSelect>
  </div>
</template>

<style lang="scss" scoped>
.icon-size {
  @apply w-7 h-7;
}
</style>
