<script setup lang="ts">
import type { PropType } from 'vue'
import { onSocketEvent } from '~/composables/socket-v2.composable'
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

const logger = useLogger()

onSocketEvent(
  'ice_candidate_sent',
  async ({
    clientId,
    iceCandidate,
  }: {
    clientId: string
    iceCandidate: RTCIceCandidateInit
    roomId: string
  }) => {
    const { peerConnection } = props

    logger.debug('Incoming ice candidate from client %s...', clientId)
    try {
      await peerConnection.addIceCandidate(iceCandidate)
      logger.info('Added ice candidate from client %s', clientId)
    } catch (e) {
      logger.warn('Failed adding ice candidate from client %s', clientId)
    }
  },
)
</script>
