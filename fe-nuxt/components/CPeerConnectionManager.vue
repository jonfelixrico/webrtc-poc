<script setup lang="ts">
import type { PropType } from 'vue'
import {
  useStreamReceiver,
  useStreamSender,
} from '~/composables/rtc-media.composable'
import {
  useIceCandidateHandlers,
  useNegotiationHandlers,
  useStatesListeners,
} from '~/composables/rtc-signaling-individual.composable'

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

useNegotiationHandlers(props.peerConnection, props.peerClientId)
useIceCandidateHandlers(props.peerConnection, props.peerClientId)
useStreamSender(props.peerConnection)
useStreamReceiver(props.peerConnection, props.peerClientId)
useStatesListeners(props.peerConnection, props.peerClientId)
</script>

<template></template>
