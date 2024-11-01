import { nextTick, useLogger } from '#imports'
import { useAppSocketEmit } from '~/composables/app-socket.composable'
import { onSocketAvailable } from '~/composables/socket.composable'
import { useWebRtcStore } from '~/store/web-rtc.store'
import { ICE_SERVERS } from '~/typings/ice-servers.const'

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
