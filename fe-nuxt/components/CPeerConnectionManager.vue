<script setup lang="ts">
import type { PropType } from 'vue'
import {
  useStreamReceiver,
  useStreamSender,
} from '~/composables/rtc-media.composable'
import {
  useCandidateHandlers,
  useFailedConnectionCleanup,
  useNegotiationNeededHandler,
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
useNegotiationNeededHandler(props.peerConnection, props.peerClientId)
useFailedConnectionCleanup(props.peerClientId)

const logger = useLogger()
logger.debug('Started manager for client %s', props.peerClientId)
</script>

<!--
  This is a renderless component, so we're not placing anything inside the template.
-->
<!-- eslint-disable-next-line vue/valid-template-root -->
<template></template>
