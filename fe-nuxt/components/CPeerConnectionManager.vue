<script setup lang="ts">
import type { PropType } from 'vue'
import {
  useStreamReceiver,
  useStreamSender,
} from '~/composables/rtc-media.composable'
import {
  useCandidateHandlers,
  useStatesListeners,
} from '~/composables/rtc-signaling-individual.composable'
import { useLogger } from '~/composables/logger.composable'

const props = defineProps({
  peerConnection: {
    type: Object as PropType<RTCPeerConnection>,
    required: true,
  },

  peerClientId: {
    type: String,
    required: true,
  },
})

useCandidateHandlers(props.peerConnection, props.peerClientId)
useStreamSender(props.peerClientId)
useStreamReceiver(props.peerConnection, props.peerClientId)
useStatesListeners(props.peerConnection, props.peerClientId)

const logger = useLogger()
logger.debug('Started manager for client %s', props.peerClientId)
</script>

<template></template>
