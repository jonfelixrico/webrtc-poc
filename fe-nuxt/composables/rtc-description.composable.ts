import { toValue } from 'vue'
import {
  onSocketEvent,
  useSocketFromStore,
} from '~/composables/socket-v2.composable'
import { useLogger } from '~/composables/logger.composable'
import { ICE_SERVERS } from '~/typings/ice-servers.const'
import { useWebRtcStore } from '~/store/web-rtc.store'

export function useDescriptionHandlers() {
  const logger = useLogger()
  const socket = useSocketFromStore()

  const store = useWebRtcStore()

  onSocketEvent(
    'description_sent',
    async ({
      fromClientId,
      description,
    }: {
      fromClientId: string
      description: RTCSessionDescriptionInit
    }) => {
      if (!store.connections[fromClientId]) {
        store.setConnection(
          fromClientId,
          new RTCPeerConnection({
            iceServers: ICE_SERVERS,
            iceTransportPolicy: 'relay',
          }),
          {
            polite: true,
          },
        )
        logger.info('Created connection for %s', fromClientId)
      }

      const { connection, isMakingOffer, polite } =
        store.connections[fromClientId]
      const vSocket = toValue(socket)

      const offerCollision =
        description.type === 'offer' &&
        (isMakingOffer || connection.signalingState !== 'stable')

      const shouldIgnoreOffer = offerCollision && !polite
      store.setSignalingFlag(
        fromClientId,
        'shouldIgnoreOffer',
        shouldIgnoreOffer,
      )

      if (!shouldIgnoreOffer) {
        logger.debug('Offer ignored from %s', fromClientId)
        return
      }

      try {
        await connection.setRemoteDescription(description)
        if (description.type === 'offer') {
          await connection.setLocalDescription()
          vSocket.send('send_description', {
            toClientId: fromClientId,
            description: connection.localDescription,
          })
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
