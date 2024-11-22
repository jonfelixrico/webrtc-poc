<script setup lang="ts">
import { reactive, type PropType } from 'vue'
import CMediaStreamRendererVideo from '~/components/media-stream/CMediaStreamRendererVideo.vue'
import type { DeviceState } from '~/typings/media.types'
import { useI18n } from 'vue-i18n'
import { useUserMediaStream } from '~/composables/media.composable'
import CPrejoinControls from '~/components/pre-join/CPrejoinControls.vue'

defineProps({
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
  required: true,
})

const audio = defineModel('audio', {
  type: Object as PropType<DeviceState>,
  required: true,
})

const stream = useUserMediaStream(
  reactive({
    audio,
    video,
  }),
)

const { t } = useI18n()
</script>

<template>
  <div class="relative isolate">
    <div
      class="flex flex-col justify-end gap-y-2 h-full w-full absolute z-20 p-1"
    >
      <div class="flex flex-row justify-center gap-x-4 items-center">
        <CPrejoinControls
          v-model:audio="audio"
          v-model:video="video"
          :audio-devices
          :video-devices
        />
      </div>
    </div>

    <template v-if="stream">
      <!--
        The purpose of this div is for the gradient alone. I can't seem to make it appear if applied
        directly on the component or if applied on a div that wrapped the component
      -->
      <div class="h-full w-full absolute z-10 overlay-gradient" />
      <CMediaStreamRendererVideo
        :key="stream.id"
        :media-stream="stream"
        class="h-full w-full"
        object-fit="cover"
      />
    </template>

    <div
      v-else
      class="h-full w-full flex flex-col justify-center items-center bg-zinc-800 text-white text-2xl font-medium"
    >
      {{ t('preCall.cameraOff') }}
    </div>
  </div>
</template>

<style scoped>
.overlay-gradient {
  background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
}
</style>
