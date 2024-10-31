<script setup lang="ts">
import type { PropType } from 'vue'
import {
  useIceCandidateHandlers,
  useNegotiationHandlers,
} from '~/composables/rtc-signaling-v2.composable'

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
</script>
