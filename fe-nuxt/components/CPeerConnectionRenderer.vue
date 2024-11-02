<script setup lang="ts">
import { computed, useTemplateRef, type PropType } from 'vue'
import CMediaStreamRenderer from '~/components/CMediaStreamRenderer.vue'
import { useResizeObserverValue } from '~/composables/vueuse-extensions.composables'
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

const divRef = useTemplateRef('div')
const dimensions = useResizeObserverValue(divRef)
</script>

<template>
  <div ref="div" class="flex flex-col justify-center items-center">
    <div v-if="!isConnectionReady">Waiting for connection ...</div>

    <CMediaStreamRenderer
      v-else-if="stream"
      :media-stream="stream"
      :width="dimensions.width"
      :height="dimensions.height"
    >
      <template #audio-only> Audio only </template>
    </CMediaStreamRenderer>

    <div v-else>Waiting for user content ...</div>
  </div>
</template>
