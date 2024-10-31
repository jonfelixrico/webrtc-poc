import { onBeforeUnmount, watch } from 'vue'
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
        } catch (e) {
          logger.warn('Error encountered while adding track %s', track.id, e)
        }
      }
    },
  )
}

export function useStreamReceiver(
  peerConnection: RTCPeerConnection,
  peerClientId: string,
) {
  const store = useWebRtcStore()

  function addTrackToStore(track: RTCTrackEvent) {
    store.$state.streams[peerClientId] = track.streams[0] ?? null
  }

  peerConnection.addEventListener('track', addTrackToStore)

  onBeforeUnmount(() => {
    peerConnection.removeEventListener('track', addTrackToStore)
  })
}
