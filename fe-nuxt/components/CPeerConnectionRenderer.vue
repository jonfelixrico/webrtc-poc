<script setup lang="ts">
import { computed, useTemplateRef, type PropType } from 'vue'
import CMediaStreamRenderer from '~/components/CMediaStreamRenderer.vue'
import { useResizeObserverValue } from '~/composables/vueuse-extensions.composables'
import type { AppPeerConnection } from '~/typings/rtc.types'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  connection: {
    type: Object as PropType<AppPeerConnection>,
    required: true,
  },

  displayName: {
    type: String,
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

const { t } = useI18n()
</script>

<template>
  <div ref="div">
    <div
      v-if="!isConnectionReady || !stream"
      class="h-full w-full flex flex-col items-center justify-center bg-zinc-800 text-white"
    >
      <div class="text-2xl font-medium">{{ displayName }}</div>

      <div v-if="!isConnectionReady" class="flex flex-row items-center gap-1">
        {{ t('call.waitingForConnection') }}
        <UIcon name="i-eos-icons-three-dots-loading" class="w-8 h-8" />
      </div>
    </div>

    <CMediaStreamRenderer
      v-else-if="stream"
      :media-stream="stream"
      :width="dimensions.width"
      :height="dimensions.height"
    >
      <template #audio-only>
        <div
          class="h-full w-full flex flex-col items-center justify-center bg-zinc-800 text-white"
        >
          <div class="text-2xl font-medium">{{ displayName }}</div>
        </div>
      </template>
    </CMediaStreamRenderer>
  </div>
</template>
