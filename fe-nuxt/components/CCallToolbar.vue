<script setup lang="ts">
import { useDevicesList, useUserMedia } from '@vueuse/core'
import { computed, ref, toValue, watch } from 'vue'
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

const aId = ref<string | null>(null)
const aEnabled = ref<boolean>(false)
const vId = ref<string | null>(null)
const vEnabled = ref<boolean>(false)

const constraints = computed<MediaStreamConstraints>(() => {
  const value: MediaStreamConstraints = {}

  if (toValue(aId) && toValue(aEnabled)) {
    value.audio = {
      deviceId: toValue(aId) as string,
    }
  }

  if (toValue(vId) && toValue(vEnabled)) {
    value.video = {
      deviceId: toValue(vId) as string,
    }
  }

  return value
})

watch(constraints, (c) => console.log(c))

const { stream } = useUserMedia({
  enabled: computed(() => Object.keys(toValue(constraints)).length > 0),
  constraints,
  autoSwitch: true,
})

const msStore = useMediaStreamStore()
watch(stream, (stream) => {
  logger.info(
    'Media stream has changed; video: %s, audio: %s',
    toValue(vId),
    toValue(aId),
  )
  msStore.mediaStream = stream ?? null
})
</script>

<template>
  <div class="flex flex-row">
    <CDeviceSelect
      v-model="aId"
      v-model:enabled="aEnabled"
      :devices="audioInputs"
    />
    <CDeviceSelect
      v-model="vId"
      v-model:enabled="vEnabled"
      :devices="videoInputs"
    />
  </div>
</template>
