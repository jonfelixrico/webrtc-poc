import { computed, onBeforeUnmount, toValue, type Ref } from 'vue'
import {
  onSocketEvent,
  useSocketFromStore,
} from '~/composables/socket-v2.composable'
import { useLogger } from '~/composables/logger.composable'
import { ICE_SERVERS } from '~/typings/ice-servers.const'
import { makeConnectionReactive } from '#imports'
import { useWebRtcStore } from '~/store/web-rtc.store'

export function useNegotiationHandlers(
  peerConnection: Ref<RTCPeerConnection>,
  peerClientId: Ref<string>,
) {
  const logger = useLogger()
  const store = useWebRtcStore()
  const socket = useSocketFromStore()

  const connObj = computed({
    get: () => store.$state.connections[toValue(peerClientId)],

    set: (val) => {
      store.$state.connections[toValue(peerClientId)] = val
    },
  })

  onSocketEvent(
    'offer_accepted',
    ({
      clientId,
      rtcSession,
    }: {
      clientId: string
      rtcSession: RTCSessionDescriptionInit
    }) => {
      if (clientId !== toValue(peerClientId)) {
        return
      }

      toValue(peerConnection).setRemoteDescription(
        new RTCSessionDescription(rtcSession),
      )
      logger.info('Completed handshake with client %s', clientId)
    },
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
      if (clientId !== toValue(peerClientId)) {
        return
      }

      logger.info('Received offer from client %s', clientId)

      const conn = new RTCPeerConnection({
        iceServers: ICE_SERVERS,
        iceTransportPolicy: 'relay',
      })
      const reactiveConn = makeConnectionReactive(conn)
      connObj.value = reactiveConn

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

export function useIceCandidateHandlers(
  peerConnection: RTCPeerConnection,
  peerClientId: string,
) {
  const logger = useLogger()
  const socket = useSocketFromStore()

  const candidates = new Set<RTCIceCandidate>()

  onSocketEvent(
    'ice_candidate_sent',
    async ({
      clientId,
      iceCandidate,
    }: {
      clientId: string
      iceCandidate: RTCIceCandidateInit
    }) => {
      if (clientId !== peerClientId) {
        return
      }

      logger.debug('Incoming ice candidate from client %s...', clientId)
      try {
        await peerConnection.addIceCandidate(iceCandidate)
        logger.info('Added ice candidate from client %s', clientId)
      } catch (e) {
        logger.warn('Failed adding ice candidate from client %s', clientId)
      }
    },
  )

  onSocketEvent('offer_accepted', ({ clientId }: { clientId: string }) => {
    if (clientId !== peerClientId) {
      return
    }
  })

  onSocketEvent('offer_sent', ({ clientId }: { clientId: string }) => {
    if (clientId !== peerClientId) {
      return
    }
  })

  function storeCandidate({ candidate }: RTCPeerConnectionIceEvent) {
    if (!candidate) {
      return
    }

    candidates.add(candidate)
  }
  peerConnection.addEventListener('icecandidate', storeCandidate)
  onBeforeUnmount(() => {
    peerConnection.removeEventListener('icecandidate', storeCandidate)
  })

  function clearCandidates() {
    candidates.clear()
  }
  peerConnection.addEventListener('negotiationneeded', clearCandidates)
  onBeforeUnmount(() => {
    peerConnection.removeEventListener('negotiationneeded', clearCandidates)
  })
}
