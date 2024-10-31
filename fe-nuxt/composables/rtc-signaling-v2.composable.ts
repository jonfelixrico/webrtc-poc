import { computed, onBeforeUnmount, toValue } from 'vue'
import {
  onSocketEvent,
  useSocketFromStore,
} from '~/composables/socket-v2.composable'
import { useLogger } from '~/composables/logger.composable'
import { ICE_SERVERS } from '~/typings/ice-servers.const'
import { makeConnectionReactive } from '#imports'
import { useWebRtcStore } from '~/store/web-rtc.store'

export function useSendOffer() {
  const store = useWebRtcStore()
  const logger = useLogger()
  const socket = useSocketFromStore()

  async function sendOffer(clientId: string) {
    const conn = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
      iceTransportPolicy: 'relay',
    })

    const reactiveConn = makeConnectionReactive(conn)

    const offer = await conn.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    })
    await conn.setLocalDescription(offer)

    toValue(socket).emit('send_offer', {
      clientId,
      rtcSession: offer,
    })
    logger.debug('Sent an offer to client %s', clientId)

    store.$state.connections[clientId] = reactiveConn
  }

  return sendOffer
}

export function useNegotiationHandlers(
  peerConnection: RTCPeerConnection,
  peerClientId: string,
) {
  const logger = useLogger()
  const store = useWebRtcStore()
  const socket = useSocketFromStore()

  const connObj = computed({
    get: () => store.$state.connections[peerClientId],

    set: (val) => {
      store.$state.connections[peerClientId] = val
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
      if (clientId !== peerClientId) {
        return
      }

      peerConnection.setRemoteDescription(new RTCSessionDescription(rtcSession))
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

  const sendOffer = useSendOffer()
  function handleNegotiationNeeded() {
    logger.info('Negotiation needed with client %s', peerClientId)
    sendOffer(peerClientId)
  }
  peerConnection.addEventListener('negotiationneeded', handleNegotiationNeeded)
  peerConnection.removeEventListener(
    'negotiationneeded',
    handleNegotiationNeeded,
  )
}

export function useIceCandidateHandlers(
  peerConnection: RTCPeerConnection,
  peerClientId: string,
) {
  const logger = useLogger()
  const socket = useSocketFromStore()

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

  const candidates = new Set<RTCIceCandidate>()
  let emitCandidates = false

  function handleRemoteAck({ clientId }: { clientId: string }) {
    if (clientId !== peerClientId) {
      return
    }

    if (emitCandidates) {
      logger.warn(
        'Strange state. handleRemoteAck is triggered but emitCandidates is already true',
      )
      return
    }

    for (const candidate of candidates) {
      toValue(socket).emit('send_ice_candidate', {
        clientId: peerClientId,
        iceCandidate: candidate,
      })
    }
    emitCandidates = true
  }
  onSocketEvent('offer_accepted', handleRemoteAck)
  onSocketEvent('offer_sent', handleRemoteAck)

  function handleCandidateFound({ candidate }: RTCPeerConnectionIceEvent) {
    if (!candidate) {
      return
    }

    if (emitCandidates) {
      toValue(socket).emit('send_ice_candidate', {
        clientId: peerClientId,
        iceCandidate: candidate,
      })
    }

    candidates.add(candidate)
  }
  peerConnection.addEventListener('icecandidate', handleCandidateFound)
  onBeforeUnmount(() => {
    peerConnection.removeEventListener('icecandidate', handleCandidateFound)
  })

  function handleReset() {
    candidates.clear()
    emitCandidates = false
  }
  peerConnection.addEventListener('negotiationneeded', handleReset)
  onBeforeUnmount(() => {
    peerConnection.removeEventListener('negotiationneeded', handleReset)
  })
}
