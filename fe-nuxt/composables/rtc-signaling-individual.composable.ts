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

      const { polite, isMakingOffer } = toValue(connection)
      const vSocket = toValue(socket)

      const offerCollision =
        rtcSession.type === 'offer' &&
        (isMakingOffer || peerConnection.signalingState !== 'stable')

      const shouldIgnoreOffer = !polite && offerCollision
      store.setSignalingFlag(clientId, 'shouldIgnoreOffer', shouldIgnoreOffer)

      if (shouldIgnoreOffer) {
        logger.debug('Ignored offer from client %s', clientId)
        return
      }

      logger.info('Received offer from client %s', clientId)
      await peerConnection.setRemoteDescription(rtcSession)
      if (rtcSession.type === 'offer') {
        await peerConnection.setLocalDescription()
        vSocket.emit('accept_offer', {
          clientId,
          rtcSession: peerConnection.localDescription,
        })
      }

      logger.info('Sent offer acceptance to client %s', clientId)
    },
  )

  addListener('negotiationneeded', async () => {
    logger.info('Negotiation needed with client %s', peerClientId)

    try {
      store.setSignalingFlag(peerClientId, 'isMakingOffer', true)

      await peerConnection.setLocalDescription()
      toValue(socket).emit('send_offer', {
        clientId: peerClientId,
        rtcSession: peerConnection.localDescription,
      })
    } finally {
      store.setSignalingFlag(peerClientId, 'isMakingOffer', false)
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
  function handleRemoteAck({ clientId }: { clientId: string }) {
    if (clientId !== peerClientId) {
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
  }
  onSocketEvent('offer_accepted', handleRemoteAck)
  onSocketEvent('offer_sent', handleRemoteAck)

  addListener('icecandidate', ({ candidate }: RTCPeerConnectionIceEvent) => {
    if (!candidate) {
      return
    }

    logger.debug('Obtained candidate')

    toValue(socket).emit('send_ice_candidate', {
      clientId: peerClientId,
      iceCandidate: candidate,
    })

    candidates.add(candidate)
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
