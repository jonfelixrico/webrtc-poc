import { computed, toValue } from 'vue'
import {
  onSocketEvent,
  useSocketFromStore,
} from '~/composables/socket-v2.composable'
import { useLogger } from '~/composables/logger.composable'
import { ICE_SERVERS } from '~/typings/ice-servers.const'
import { useWebRtcStore } from '~/store/web-rtc.store'

export function useNewOfferListener() {
  const logger = useLogger()

  const store = useWebRtcStore()
  const socket = useSocketFromStore()

  const existingClientIds = computed(
    () => new Set(Object.keys(store.connections)),
  )

  onSocketEvent(
    'offer_sent',
    async ({
      clientId,
      rtcSession,
    }: {
      clientId: string
      rtcSession: RTCSessionDescriptionInit
    }) => {
      if (toValue(existingClientIds).has(clientId)) {
        // Reaching this point means that the offer_event probably is for a re-negotiation
        return
      }

      logger.info('Received offer from client %s', clientId)

      const conn = new RTCPeerConnection({
        iceServers: ICE_SERVERS,
        iceTransportPolicy: 'relay',
      })
      store.setConnection(clientId, conn, {
        polite: true,
      })

      function emitCandidate({ candidate }: RTCPeerConnectionIceEvent) {
        toValue(socket).emit('send_ice_candidate', {
          clientId,
          iceCandidate: candidate,
        })

        logger.debug('Sent ice candidate to client %s', clientId)

        if (conn.iceGatheringState === 'complete') {
          logger.debug('Ice gathering is complete, removing listener')
          conn.removeEventListener('icecandidate', emitCandidate)
        }
      }
      conn.addEventListener('icecandidate', emitCandidate)

      await conn.setRemoteDescription(new RTCSessionDescription(rtcSession))
      const answer = await conn.createAnswer()
      await conn.setLocalDescription(answer)

      toValue(socket).emit('accept_offer', {
        rtcSession: answer,
        clientId,
      })
      logger.info('Sent offer acceptance to client %s', clientId)
    },
  )
}
