import { computed, watch } from 'vue'
import { useMediaStreamStore } from '~/store/media-stream.store'
import { useLogger } from '~/composables/logger.composable'
import { useWebRtcStore } from '~/store/web-rtc.store'
import { useAddListener } from '#imports'

export function useStreamSender(peerClientId: string) {
  const msStore = useMediaStreamStore()
  const rtcStore = useWebRtcStore()
  const logger = useLogger()

  const conn = computed(() => {
    const entry = rtcStore.connections[peerClientId]

    if (entry?.states?.connectionState !== 'connected') {
      return
    }

    return entry.connection
  })

  watch(
    [() => msStore.mediaStream, conn],
    ([stream, conn]) => {
      if (!stream || !conn) {
        return
      }

      for (const track of stream.getTracks()) {
        try {
          conn.addTrack(track, stream)
          logger.debug('Added track %s to client %s', track.id, peerClientId)
        } catch (e) {
          logger.warn(
            e,
            'Error encountered while adding track %s for client %s',
            track.id,
            peerClientId,
          )
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
  const addListener = useAddListener(peerConnection)

  addListener('track', function ({ track, streams }: RTCTrackEvent) {
    const [firstTrack] = streams

    if (!firstTrack) {
      logger.debug('Received empty track from %s', peerClientId)
    }

    logger.debug(
      'Received track %s from client %s',
      firstTrack.id,
      peerClientId,
    )
    track.addEventListener(
      'unmute',
      () => {
        store.setStream(peerClientId, firstTrack)
        logger.info(
          'Committed track %s from client %s',
          firstTrack.id,
          peerClientId,
        )
      },
      {
        once: true,
      },
    )
  })
}
