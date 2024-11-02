<script setup lang="ts">
import { computed, type PropType } from 'vue'
import CMediaStreamRenderer from '~/components/CMediaStreamRenderer.vue'
import type { AppPeerConnection } from '~/typings/rtc.types'

const props = defineProps({
  connection: {
    type: Object as PropType<AppPeerConnection>,
    required: true,
  },
})

const stream = computed(() => props.connection.stream)

const isConnectionReady = computed(() => {
  const { connectionState, iceConnectionState, signalingState } =
    props.connection.states

  return (
    connectionState === 'connected' &&
    iceConnectionState === 'connected' &&
    signalingState === 'stable'
  )
})
</script>

<template>
  <div class="flex flex-col">
    <div
      class="flex justify-center items-center"
      :style="{ width: '400px', height: '400px' }"
    >
      <div v-if="!isConnectionReady">Waiting for connection ...</div>

      <CMediaStreamRenderer
        v-else-if="stream"
        :media-stream="stream"
        :width="400"
        :height="400"
      />

      <!-- At this point we can assume that the connection is ready but there's just no stream -->
      <div v-else>Waiting for user content ...</div>
    </div>

    <!-- TODO replace with name -->
    <div>{{ connection.clientId }}</div>
  </div>
</template>
