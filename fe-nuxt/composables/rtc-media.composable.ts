import { onBeforeUnmount, watch } from 'vue'
import { useMediaStreamStore } from '~/store/media-stream.store'
import { useLogger } from '~/composables/logger.composable'
import { useWebRtcStore } from '~/store/web-rtc.store'

export function useStreamSender(peerConnection: RTCPeerConnection) {
  const store = useMediaStreamStore()
  const logger = useLogger()

  watch(
    () => store.mediaStream,
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

  function addTrackToStore(track: RTCTrackEvent) {
    const [firstTrack] = track.streams
    store.setStream(peerClientId, firstTrack)
  }

  peerConnection.addEventListener('track', addTrackToStore)

  onBeforeUnmount(() => {
    peerConnection.removeEventListener('track', addTrackToStore)
  })
}
