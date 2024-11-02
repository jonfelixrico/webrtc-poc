import { onSocketAvailable } from '~/composables/socket.composable'
import { nextTick } from 'vue'
import { useLogger } from '~/composables/logger.composable'
import { ICE_SERVERS } from '~/typings/ice-servers.const'
import { useWebRtcStore } from '~/store/web-rtc.store'
import {
  onAppSocketEvent,
  useAppSocketEmit,
} from '~/composables/app-socket.composable'

export function useDescriptionHandlers() {
  const logger = useLogger()
  const store = useWebRtcStore()
  const socketEmit = useAppSocketEmit()

  onAppSocketEvent(
    'description_sent',
    async ({
      fromClientId,
      description,
    }: {
      fromClientId: string
      description: RTCSessionDescription
    }) => {
      logger.debug('Description sent from client %s', fromClientId)

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
          socketEmit('send_description', {
            toClientId: fromClientId,
            description: connection.localDescription as RTCSessionDescription,
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

export function useJoinHandler(roomId: string) {
  const logger = useLogger()

  const store = useWebRtcStore()

  const socketEmit = useAppSocketEmit()

  async function createConnection(peerClientId: string) {
    const conn = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
      iceTransportPolicy: 'relay',
    })
    store.setConnection(peerClientId, conn)
    await nextTick()

    logger.debug('Generating offers for %s...', peerClientId)
    await conn.setLocalDescription(
      await conn.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      }),
    )

    socketEmit('send_description', {
      toClientId: peerClientId,
      description: conn.localDescription as RTCSessionDescription,
    })
    logger.info('Sent an offer to client %s', peerClientId)
  }

  onSocketAvailable((sock) => {
    socketEmit('join', {
      roomId,
    })
    logger.debug('Emitted join to room %s', roomId)

    sock.once('user_list_synced', async (payload: { clientIds: string[] }) => {
      logger.debug(
        'Received initial user list. %s users',
        payload.clientIds.length,
      )

      for (const clientId of payload.clientIds) {
        if (clientId === sock.id) {
          continue
        }

        await createConnection(clientId)
      }
    })
  })
}
