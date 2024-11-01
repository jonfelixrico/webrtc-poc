import { nextTick, toValue } from 'vue'
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
      description: RTCSessionDescription
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

        await nextTick()
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
          vSocket.send('send_description', {
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
