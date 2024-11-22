<script setup lang="ts">
import { useModal } from '#imports'
import { type PropType, computed } from 'vue'
import CPreCallDevicesModal from '~/components/pre-join/CPreCallDevicesModal.vue'
import type { DeviceState } from '~/typings/media.types'
import { useI18n } from 'vue-i18n'
import CPreCallDeviceToggle from '~/components/pre-join/CPreCallDeviceToggle.vue'

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

  modal.open(CPreCallDevicesModal, {
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

const { t } = useI18n()
</script>

<template>
  <CPreCallDeviceToggle
    v-model="videoEnabled"
    icon-enabled="i-ri-video-on-fill"
    icon-disabled="i-ri-video-off-fill"
    class="text-primary"
  />

  <CPreCallDeviceToggle
    v-model="audioEnabled"
    icon-enabled="i-ri-mic-fill"
    icon-disabled="i-ri-mic-off-fill"
    class="text-primary"
  />

  <UButton
    variant="ghost"
    :label="t('preCall.devices')"
    icon="i-material-symbols-settings"
    @click="openDialog"
  />
</template>
