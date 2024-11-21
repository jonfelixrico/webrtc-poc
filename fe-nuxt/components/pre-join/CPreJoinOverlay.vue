<script setup lang="ts">
import { computed, useModal } from '#imports'
import type { PropType } from 'vue'
import CPrejoinDevicesDialog from '~/components/pre-join/CPrejoinDevicesModal.vue'
import type { DeviceState } from '~/typings/media.types'

const video = defineModel('video', {
  type: Object as PropType<DeviceState>,
  required: true,
})
const videoEnabled = computed({
  get: () => video.value.enabled,
  set: (enabled) => {
    video.value = {
      ...video.value,
      enabled,
    }
  },
})

const audio = defineModel('audio', {
  type: Object as PropType<DeviceState>,
  required: true,
})
const audioEnabled = computed({
  get: () => audio.value.enabled,
  set: (enabled) => {
    audio.value = {
      ...audio.value,
      enabled,
    }
  },
})

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
const modal = useModal()
function openDialog() {
  const { videoDevices, audioDevices } = props

  modal.open(CPrejoinDevicesDialog, {
    onSubmit: (v) => {
      video.value = {
        ...video.value,
        id: v.videoId,
      }
      audio.value = {
        ...audio.value,
        id: v.audioId,
      }
    },

    audioDevices,
    videoDevices,

    audioId: audio.value?.id ?? '',
    videoId: video.value?.id ?? '',
  })
}
</script>

<template>
  <div class="flex flex-col justify-end">
    <div class="flex flex-row justify-center gap-4 items-center">
      <!-- TODO add icon -->
      <UToggle v-model="videoEnabled" />

      <!-- TODO add icon -->
      <UToggle v-model="audioEnabled" />

      <!-- TODO add icon; i18n label -->
      <UButton variant="ghost" label="Devices" @click="openDialog" />
    </div>
  </div>
</template>
