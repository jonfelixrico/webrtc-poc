<script setup lang="ts">
import { useDevicesList, useUserMedia } from '@vueuse/core'
import { reactive, ref, toValue, watch } from 'vue'
import { useMediaStreamStore } from '~/store/media-stream.store'

const { audioInputs, videoInputs } = useDevicesList({
  constraints: {
    audio: true,
    video: true,
  },
  requestPermissions: true,
})

const audioId = ref<string>()
const videoId = ref<string>()

watch(
  audioInputs,
  (inputs) => {
    if (toValue(audioId)) {
      return
    }

    audioId.value = inputs[0]?.deviceId
  },
  {
    immediate: true,
  },
)

watch(
  videoInputs,
  (inputs) => {
    if (toValue(videoId)) {
      return
    }

    videoId.value = inputs[0]?.deviceId
  },
  {
    immediate: true,
  },
)

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
  msStore.mediaStream = stream ?? null
})
</script>

<template>
  <div class="flex flex-row">
    <USelect
      v-model="videoId"
      :options="videoInputs"
      option-attribute="label"
      value-attribute="deviceId"
    />
    <USelect
      v-model="audioId"
      :options="audioInputs"
      option-attribute="label"
      value-attribute="deviceId"
    />
  </div>
</template>
