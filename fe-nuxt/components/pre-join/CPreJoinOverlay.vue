<script setup lang="ts">
import { useModal } from '#imports'
import type { PropType } from 'vue'
import CPrejoinDevicesDialog from '~/components/pre-join/CPrejoinDevicesDialog.vue'

const videoEnabled = defineModel('videoEnabled', {
  type: Boolean,
})

const videoId = defineModel('videoId', {
  type: String,
  default: null,
})

const audioEnabled = defineModel('videoEnabled', {
  type: Boolean,
})

const audioId = defineModel('audioId', {
  type: String,
  default: null,
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
      videoId.value = v.videoId
      audioId.value = v.audioId
    },

    audioDevices,
    videoDevices,
  })
}
</script>

<template>
  <div class="flex flex-col justify-end">
    <div class="flex flex-row justify-center gap-4">
      <!-- TODO add icon -->
      <UToggle v-model="videoEnabled" />

      <!-- TODO add icon -->
      <UToggle v-model="audioEnabled" />

      <!-- TODO add icon; i18n label -->
      <UButton variant="ghost" label="Devices" @click="openDialog" />
    </div>
  </div>
</template>
