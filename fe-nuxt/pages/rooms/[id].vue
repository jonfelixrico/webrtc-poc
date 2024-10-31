<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  computed,
  definePageMeta,
  markRaw,
  onMounted,
  toValue,
  watch,
} from '#imports'
import CMediaStreamRenderer from '~/components/CMediaStreamRenderer.vue'
import { useMediaStreamStore } from '~/store/media-stream.store'
import { useDevicesList, useUserMedia } from '@vueuse/core'
import { useWebRtcStore } from '~/store/web-rtc.store'
import { useJoinHandler } from '~/composables/rtc-bl.composables'
import { useLogger } from '~/composables/logger.composable'
import CPeerConnectionManager from '~/components/CPeerConnectionManager.vue'
import { useSocketInit } from '~/composables/socket-v2.composable'
import { useNewOfferListener } from '~/composables/rtc-signaling-v2.composable'

definePageMeta({
  validate: (route) =>
    $fetch(`/be/room/${route.params.id}`)
      // TODO add error-specific handling
      .then(() => true)
      .catch(() => false),
})

const route = useRoute()

const mediaStreamStore = useMediaStreamStore()
const connStore = useWebRtcStore()
const connections = computed(() => connStore.$state.connections)
const streams = computed(() => connStore.$state.streams)
const logger = useLogger()

if (import.meta.client) {
  useSocketInit()
  useJoinHandler(String(route.params.id))
  useNewOfferListener()

  const { videoInputs } = useDevicesList({
    requestPermissions: true,
    constraints: {
      audio: false,
      video: true,
    },
  })

  const cam = computed(() => toValue(videoInputs)[0]?.deviceId)

  const { stream, start } = useUserMedia({
    constraints: {
      video: { deviceId: toValue(cam) },
    },
  })
  onMounted(() => {
    start().catch((e) => logger.error(e))
  })
  watch(
    stream,
    (stream) => {
      mediaStreamStore.$state.mediaStream = stream ? markRaw(stream) : null
    },
    {
      immediate: true,
    },
  )
}
</script>

<template>
  <div class="flex flex-row">
    <div class="flex-1">
      <ClientOnly>
        <CMediaStreamRenderer
          v-if="mediaStreamStore.$state.mediaStream"
          :media-stream="mediaStreamStore.$state.mediaStream"
          :width="400"
          :height="400"
        />
      </ClientOnly>

      <CPeerConnectionManager
        v-for="({ connection }, clientId) in connections"
        :key="clientId"
        :peer-client-id="clientId"
        :peer-connection="connection"
      />
    </div>

    <div class="flex-1 flex flex-col">
      <div
        v-for="(
          { connectionState, iceGatheringState }, clientId
        ) in connections"
        :key="clientId"
      >
        {{ clientId }}
        {{ connectionState }}
        {{ iceGatheringState }}
      </div>

      <template v-for="(stream, clientId) in streams" :key="clientId">
        <div>
          {{ clientId }}
          <CMediaStreamRenderer
            :media-stream="stream"
            :width="400"
            :height="400"
          />
        </div>
      </template>
    </div>
  </div>
</template>
