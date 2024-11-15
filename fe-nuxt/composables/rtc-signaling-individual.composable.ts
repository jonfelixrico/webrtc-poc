import { computed, toValue, watch, type MaybeRef } from 'vue'
import {
  onAppSocketEvent,
  useAppSocketEmit,
} from '~/composables/app-socket.composable'
import { useLogger } from '~/composables/logger.composable'
import { useAddListener } from '~/composables/rtc-signaling-commons.composable'
import { useWebRtcStore } from '~/store/web-rtc.store'

export function useCandidateHandlers(
  peerConnection: RTCPeerConnection,
  peerClientId: string,
) {
  const logger = useLogger()
  const store = useWebRtcStore()
  const addListener = useAddListener(peerConnection)
  const connEntry = computed(() => store.connections.get(peerClientId))
  const socketEmit = useAppSocketEmit()

  logger.debug('Started candidate handler for client %s', peerClientId)

  onAppSocketEvent(
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
      if (!connEntry.value) {
        return
      }

      const { shouldIgnoreOffer } = connEntry.value

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

    socketEmit('send_candidate', {
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
  const socketEmit = useAppSocketEmit()

  const addListener = useAddListener(peerConnection)
  addListener('negotiationneeded', async () => {
    try {
      store.setSignalingFlag(peerClientId, 'isMakingOffer', true)

      logger.debug('Negotiation needed with client %s', peerClientId)
      await peerConnection.setLocalDescription()
      socketEmit('send_description', {
        toClientId: peerClientId,
        description: peerConnection.localDescription as RTCSessionDescription,
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

export function useFailedConnectionCleanup(id: MaybeRef<string>) {
  const rtcStore = useWebRtcStore()
  const logger = useLogger()

  const states = computed(() => rtcStore.connections.get(toValue(id))?.states)
  const hasFailed = computed(() => {
    const { connectionState, iceConnectionState } = states.value ?? {}

    return connectionState === 'failed' || iceConnectionState === 'failed'
  })

  watch(hasFailed, (hasFailed) => {
    if (!hasFailed) {
      return
    }

    const conId = toValue(id)

    rtcStore.connections.delete(conId)
    logger.info('Housekeeping: cleaned up connection %s', conId)
  })
}
