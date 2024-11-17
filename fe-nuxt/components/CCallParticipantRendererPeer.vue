<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { AppPeerConnection } from '~/typings/rtc.types'
import { useI18n } from 'vue-i18n'
import CCallParticipantLayout from '~/components/CCallParticipantLayout.vue'
import CMediaStreamRendererVideo from '~/components/media-stream/CMediaStreamRendererVideo.vue'
import { useHasVideo } from '~/composables/media-stream.composable'

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

const mediaStream = computed(() => props.connection?.stream)
const hasVideo = useHasVideo(mediaStream)

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
      v-if="!isConnectionReady || !mediaStream"
      :display-name
      class="h-full w-full"
    >
      <div v-if="!isConnectionReady" class="flex flex-row items-center gap-1">
        {{ t('call.waitingForConnection') }}
        <UIcon name="i-eos-icons-three-dots-loading" class="w-8 h-8" />
      </div>
    </CCallParticipantLayout>

    <template v-else-if="mediaStream">
      <CMediaStreamRendererVideo
        v-if="hasVideo"
        :key="mediaStream.id"
        :media-stream
        class="h-full w-full"
      />

      <CCallParticipantLayout v-else class="h-full w-full" :display-name />
    </template>
  </div>
</template>
