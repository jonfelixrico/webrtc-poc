import { markRaw, onBeforeUnmount, watch } from 'vue'
import { useMediaStreamStore } from '~/store/media-stream.store'
import { useLogger } from '~/composables/logger.composable'
import { useWebRtcStore } from '~/store/web-rtc.store'

export function useStreamSender(peerConnection: RTCPeerConnection) {
  const { $state } = useMediaStreamStore()
  const logger = useLogger()

  watch(
    () => $state.mediaStream,
    (stream) => {
      if (!stream) {
        return
      }

      for (const track of stream.getTracks()) {
        try {
          peerConnection.addTrack(track, stream)
          logger.debug('Added track to conn')
        } catch (e) {
          logger.warn('Error encountered while adding track %s', track.id, e)
        }
      }
    },
    {
      immediate: true,
    },
  )
}

export function useStreamReceiver(
  peerConnection: RTCPeerConnection,
  peerClientId: string,
) {
  const store = useWebRtcStore()
  const logger = useLogger()

  function addTrackToStore(track: RTCTrackEvent) {
    const [firstTrack] = track.streams

    if (!firstTrack) {
      delete store.streams[peerClientId]
      return
    }

    logger.debug('Added track from %s', peerClientId)
    store.$state.streams[peerClientId] = markRaw(firstTrack)
  }

  peerConnection.addEventListener('track', addTrackToStore)

  onBeforeUnmount(() => {
    peerConnection.removeEventListener('track', addTrackToStore)
  })
}
