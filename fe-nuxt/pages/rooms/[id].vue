<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSocket } from '~/composables/socket.composable'
import {
  useRtcJoinHandler,
  useRtcOfferListener,
} from '~/composables/rtc-signaling.composable'
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
import CPeerConnectionStreamWrapper from '~/components/CPeerConnectionStreamWrapper.vue'

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
const connections = computed(() => connStore.$state.peerConnections)

if (import.meta.client) {
  const appSocket = useSocket()
  useRtcJoinHandler(
    appSocket,
    computed(() => String(route.params.id)),
  )
  useRtcOfferListener(appSocket)

  const { videoInputs, audioInputs } = useDevicesList({
    requestPermissions: true,
    constraints: {
      audio: true,
      video: true,
    },
  })

  const cam = computed(() => toValue(videoInputs)[0]?.deviceId)
  const mic = computed(() => toValue(audioInputs)[0]?.deviceId)

  const { stream, start } = useUserMedia({
    constraints: {
      video: { deviceId: toValue(cam) },
      audio: { deviceId: toValue(mic) },
    },
  })
  onMounted(() => {
    start().catch((e) => console.error(e))
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

  watch(
    [stream, connections],
    ([newStream, newConns]) => {
      if (!newStream) {
        return
      }

      for (const key in newConns) {
        const conn = newConns[key]

        newStream.getTracks().forEach((track) => {
          conn.addTrack(track, newStream)
        })

        console.debug('added tracks to %s', key)
      }
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
    </div>

    <div class="flex-1 flex flex-col">
      <template v-for="(connection, key) in connections" :key="key">
        <div>
          {{ key }}
          <CPeerConnectionStreamWrapper v-slot="{ mediaStream }" :connection>
            <CMediaStreamRenderer
              v-if="mediaStream"
              :media-stream="mediaStream"
              :width="400"
              :height="400"
            />
          </CPeerConnectionStreamWrapper>
        </div>
      </template>
    </div>
  </div>
</template>
