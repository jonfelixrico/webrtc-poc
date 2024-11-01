import { nextTick, toValue } from 'vue'
import {
  onSocketEvent,
  useSocketFromStore,
} from '~/composables/socket-v2.composable'
import { useLogger } from '~/composables/logger.composable'
import { ICE_SERVERS } from '~/typings/ice-servers.const'
import { useWebRtcStore } from '~/store/web-rtc.store'
import { useMediaStreamStore } from '~/store/media-stream.store'

export function useDescriptionHandlers() {
  const logger = useLogger()
  const socket = useSocketFromStore()

  const rtcStore = useWebRtcStore()
  const msStore = useMediaStreamStore()

  onSocketEvent(
    'description_sent',
    async ({
      fromClientId,
      description,
    }: {
      fromClientId: string
      description: RTCSessionDescription
    }) => {
      logger.debug('Description sent from client %s', fromClientId)

      if (!rtcStore.connections[fromClientId]) {
        const conn = new RTCPeerConnection({
          iceServers: ICE_SERVERS,
          iceTransportPolicy: 'relay',
        })

        const stream = msStore.mediaStream
        if (stream) {
          for (const track of stream.getTracks()) {
            conn.addTrack(track, stream)
          }
        }

        rtcStore.setConnection(fromClientId, conn, {
          polite: true,
        })

        logger.info('Created connection for %s', fromClientId)

        await nextTick()
      }

      const { connection, isMakingOffer, polite } =
        rtcStore.connections[fromClientId]
      const vSocket = toValue(socket)

      const offerCollision =
        description.type === 'offer' &&
        (isMakingOffer || connection.signalingState !== 'stable')

      const shouldIgnoreOffer = offerCollision && !polite
      rtcStore.setSignalingFlag(
        fromClientId,
        'shouldIgnoreOffer',
        shouldIgnoreOffer,
      )

      if (shouldIgnoreOffer) {
        logger.debug('Offer ignored from client %s', fromClientId)
        return
      }

      try {
        logger.debug('Setting remote description with client %s...')
        await connection.setRemoteDescription(description)
        logger.debug(
          'Successfully set remote description with client %s',
          fromClientId,
        )

        if (description.type === 'offer') {
          logger.debug(
            'Setting local description with client %s...',
            fromClientId,
          )
          await connection.setLocalDescription()
          vSocket.emit('send_description', {
            toClientId: fromClientId,
            description: connection.localDescription,
          })
          logger.debug(
            'Successfuly set local description with client %s, also did signaling',
            fromClientId,
          )
        }
      } catch (e) {
        logger.warn(
          e,
          'Error detected while processing description from %s',
          fromClientId,
        )
      }
    },
  )
}
