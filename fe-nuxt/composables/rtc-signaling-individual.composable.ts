import { computed, toValue } from 'vue'
import { useLogger } from '~/composables/logger.composable'
import { useAddListener } from '~/composables/rtc-signaling-commons.composable'
import {
  onSocketEvent,
  useSocketFromStore,
} from '~/composables/socket-v2.composable'
import { useWebRtcStore } from '~/store/web-rtc.store'

export function useCandidateHandlers(
  peerConnection: RTCPeerConnection,
  peerClientId: string,
) {
  const logger = useLogger()
  const socket = useSocketFromStore()
  const store = useWebRtcStore()
  const addListener = useAddListener(peerConnection)
  const connEntry = computed(() => store.connections[peerClientId])

  logger.debug('Started candidate handler for client %s', peerClientId)

  onSocketEvent(
    'candidate_sent',
    async ({
      fromClientId,
      candidate,
    }: {
      fromClientId: string
      candidate: RTCIceCandidate
    }) => {
      if (fromClientId !== peerClientId) {
        return
      }
      const { shouldIgnoreOffer } = toValue(connEntry)

      logger.debug('Incoming ice candidate from client %s...', fromClientId)
      try {
        logger.debug(
          'Adding ice candidate %s from client %s...',
          candidate.foundation,
          fromClientId,
        )
        await peerConnection.addIceCandidate(candidate)
        logger.info(
          'Successfully added ice candidate %s from client %s',
          candidate.foundation,
          fromClientId,
        )
      } catch (e) {
        if (!shouldIgnoreOffer) {
          logger.warn(
            e,
            'Failed adding ice candidate %s from client %s',
            candidate.foundation,
            fromClientId,
          )
        }
      }
    },
  )

  addListener('icecandidate', ({ candidate }: RTCPeerConnectionIceEvent) => {
    if (!candidate) {
      return
    }

    toValue(socket).emit('send_candidate', {
      toClientId: peerClientId,
      candidate,
    })
    logger.debug(
      'Sent candidate %s to client %s',
      candidate.foundation,
      peerClientId,
    )
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

export function useNegotiationNeededHandler(
  peerConnection: RTCPeerConnection,
  peerClientId: string,
) {
  const logger = useLogger()
  const store = useWebRtcStore()
  const socket = useSocketFromStore()

  const addListener = useAddListener(peerConnection)
  addListener('negotiationneeded', async () => {
    const vSocket = toValue(socket)
    try {
      store.setSignalingFlag(peerClientId, 'isMakingOffer', true)

      logger.debug('Negotiation needed with client %s', peerClientId)
      await peerConnection.setLocalDescription()
      vSocket.emit('send_description', {
        toClientId: peerClientId,
        description: peerConnection.localDescription,
      })
      logger.info('Sent updated offer to client %s', peerClientId)
    } catch (err) {
      logger.warn(
        'Error encountered while handling negotiation for client %s',
        peerClientId,
        err,
      )
    } finally {
      store.setSignalingFlag(peerClientId, 'isMakingOffer', false)
    }
  })
}
