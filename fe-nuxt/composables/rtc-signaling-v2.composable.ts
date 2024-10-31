import { computed, onBeforeUnmount, toValue } from 'vue'
import {
  onSocketEvent,
  useSocketFromStore,
} from '~/composables/socket-v2.composable'
import { useLogger } from '~/composables/logger.composable'
import { ICE_SERVERS } from '~/typings/ice-servers.const'
import { makeConnectionReactive } from '#imports'
import { useWebRtcStore } from '~/store/web-rtc.store'
import { useSendOffer } from '~/composables/rtc-signaling-commons.composable'

export function useCreateConnection() {
  const store = useWebRtcStore()
  const sendOffer = useSendOffer()

  async function createConnection(peerClientId: string) {
    const conn = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
      iceTransportPolicy: 'relay',
    })

    await sendOffer(conn, peerClientId)

    const reactiveConn = makeConnectionReactive(conn)
    store.$state.connections[peerClientId] = reactiveConn
  }

  return createConnection
}

export function useNewOfferListener() {
  const logger = useLogger()

  const store = useWebRtcStore()
  const socket = useSocketFromStore()

  const existingClientIds = computed(
    () => new Set(Object.keys(store.$state.connections)),
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
        return
      }

      logger.info('Received offer from client %s', clientId)

      const conn = new RTCPeerConnection({
        iceServers: ICE_SERVERS,
        iceTransportPolicy: 'relay',
      })

      function emitCandidate({ candidate }: RTCPeerConnectionIceEvent) {
        toValue(socket).emit('send_ice_candidate', {
          clientId,
          iceCandidate: candidate,
        })
      }
      conn.addEventListener('icecandidate', emitCandidate)

      try {
        await conn.setRemoteDescription(new RTCSessionDescription(rtcSession))
        const answer = await conn.createAnswer()
        await conn.setLocalDescription(answer)

        toValue(socket).emit('accept_offer', {
          rtcSession: answer,
          clientId,
        })
        logger.info('Sent offer acceptance to client %s', clientId)

        const reactiveConn = makeConnectionReactive(conn)
        store.$state.connections[clientId] = reactiveConn
      } finally {
        conn.removeEventListener('icecandidate', emitCandidate)
      }
    },
  )
}
