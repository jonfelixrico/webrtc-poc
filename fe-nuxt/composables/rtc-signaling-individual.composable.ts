import { computed, onBeforeUnmount, toValue } from 'vue'
import { useLogger } from '~/composables/logger.composable'
import { useSendOffer } from '~/composables/rtc-signaling-commons.composable'
import {
  onSocketEvent,
  useSocketFromStore,
} from '~/composables/socket-v2.composable'
import { useWebRtcStore } from '~/store/web-rtc.store'

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

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(rtcSession),
      )
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)

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
    sendOffer(peerConnection, peerClientId)
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
