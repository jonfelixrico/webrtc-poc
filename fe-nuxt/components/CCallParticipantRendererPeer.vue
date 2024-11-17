<script setup lang="ts">
import { computed, type PropType } from 'vue'
import CMediaStreamRenderer from '~/components/CMediaStreamRenderer.vue'
import type { AppPeerConnection } from '~/typings/rtc.types'
import { useI18n } from 'vue-i18n'
import CCallParticipantLayout from '~/components/CCallParticipantLayout.vue'

const props = defineProps({
  connection: {
    type: Object as PropType<AppPeerConnection | null>,
    default: null,
  },

  displayName: {
    type: String,
    required: true,
  },
})

const stream = computed(() => props.connection?.stream)

const isConnectionReady = computed(() => {
  const { connectionState, iceConnectionState, signalingState } =
    props.connection?.states ?? {}

  return (
    connectionState === 'connected' &&
    iceConnectionState === 'connected' &&
    signalingState === 'stable'
  )
})

const { t } = useI18n()
</script>

<template>
  <div>
    <CCallParticipantLayout
      v-if="!isConnectionReady || !stream"
      :display-name
      class="h-full w-full"
    >
      <div v-if="!isConnectionReady" class="flex flex-row items-center gap-1">
        {{ t('call.waitingForConnection') }}
        <UIcon name="i-eos-icons-three-dots-loading" class="w-8 h-8" />
      </div>
    </CCallParticipantLayout>

    <CMediaStreamRenderer
      v-else-if="stream"
      :media-stream="stream"
      class="h-full w-full"
      mute-audio
    >
      <template #audio-only>
        <CCallParticipantLayout class="h-full w-full" :display-name />
      </template>
    </CMediaStreamRenderer>
  </div>
</template>
