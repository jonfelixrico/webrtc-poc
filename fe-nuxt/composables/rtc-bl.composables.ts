import { nextTick, toValue, useLogger } from '#imports'
import {
  onSocketAvailable,
  useSocketFromStore,
} from '~/composables/socket-v2.composable'
import { useWebRtcStore } from '~/store/web-rtc.store'
import { ICE_SERVERS } from '~/typings/ice-servers.const'

export function useJoinHandler(roomId: string) {
  const logger = useLogger()
  const socket = useSocketFromStore()

  const store = useWebRtcStore()

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

    toValue(socket).emit('send_description', {
      toClientId: peerClientId,
      description: conn.localDescription,
    })
    logger.info('Sent an offer to client %s', peerClientId)
  }

  onSocketAvailable((sock) => {
    sock.emit('join', {
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
