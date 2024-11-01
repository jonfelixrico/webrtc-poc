import { computed, onBeforeUnmount, toValue } from 'vue'
import { useLogger } from '~/composables/logger.composable'
import { useAddListener } from '~/composables/rtc-signaling-commons.composable'
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
  const socket = useSocketFromStore()

  const store = useWebRtcStore()
  const connection = computed(() => store.$state.connections[peerClientId])

  const addListener = useAddListener(peerConnection)

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

  let isMakingOffer = false

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

      if (peerConnection.signalingState === 'stable') {
        return
      }

      const { polite } = toValue(connection)

      if (!polite) {
        logger.info('Ignored offer from client')
        return
      }

      logger.info('Received offer from client %s', clientId)

      await Promise.all([
        peerConnection.setRemoteDescription(
          new RTCSessionDescription(rtcSession),
        ),
        peerConnection.setLocalDescription({
          type: 'rollback',
        }),
      ])

      toValue(socket).emit('accept_offer', {
        rtcSession: peerConnection.localDescription,
        clientId,
      })

      logger.info('Sent offer acceptance to client %s', clientId)
    },
  )

  addListener('negotiationneeded', async () => {
    logger.info('Negotiation needed with client %s', peerClientId)

    try {
      isMakingOffer = true
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })

      if (peerConnection.signalingState != 'stable') {
        return
      }

      await peerConnection.setLocalDescription(offer)
      toValue(socket).emit('send_offer', {
        clientId: peerClientId,
        rtcSession: peerConnection.localDescription,
      })
    } finally {
      isMakingOffer = false
    }
  })
}

export function useIceCandidateHandlers(
  peerConnection: RTCPeerConnection,
  peerClientId: string,
) {
  const logger = useLogger()
  const socket = useSocketFromStore()
  const addListener = useAddListener(peerConnection)

  logger.debug('Started candidate handler for client %s', peerClientId)

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
      logger.debug('Sent candidate to client %s', clientId)
      toValue(socket).emit('send_ice_candidate', {
        clientId: peerClientId,
        iceCandidate: candidate,
      })
    }
    logger.debug('Initial sending done')
    emitCandidates = true
  }
  onSocketEvent('offer_accepted', handleRemoteAck)
  onSocketEvent('offer_sent', handleRemoteAck)

  addListener('icecandidate', ({ candidate }: RTCPeerConnectionIceEvent) => {
    if (!candidate) {
      return
    }

    logger.debug('Obtained candidate')

    if (emitCandidates) {
      toValue(socket).emit('send_ice_candidate', {
        clientId: peerClientId,
        iceCandidate: candidate,
      })
    }

    candidates.add(candidate)
  })

  addListener('negotiationneeded', () => {
    logger.debug('Negotiationneeded detected')

    candidates.clear()
    emitCandidates = false
  })
}

export function useStatesListeners(
  peerConnection: RTCPeerConnection,
  peerClientId: string,
) {
  const addListener = useAddListener(peerConnection)
  const store = useWebRtcStore()

  function updateStates() {
    store.setStateValue(
      peerClientId,
      'connectionState',
      peerConnection.connectionState,
    )

    store.setStateValue(
      peerClientId,
      'iceConnectionState',
      peerConnection.iceConnectionState,
    )

    store.setStateValue(
      peerClientId,
      'iceGatheringState',
      peerConnection.iceGatheringState,
    )

    store.setStateValue(
      peerClientId,
      'signalingState',
      peerConnection.signalingState,
    )
  }

  addListener('connectionstatechange', updateStates)
  addListener('iceconnectionstatechange', updateStates)
  addListener('icegatheringstatechange', updateStates)
  addListener('signalingstatechange', updateStates)
  updateStates()
}
