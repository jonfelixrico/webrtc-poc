import { useLogger, useSendOffer } from '#imports'
import { onSocketAvailable } from '~/composables/socket-v2.composable'
import { useWebRtcStore } from '~/store/web-rtc.store'
import { ICE_SERVERS } from '~/typings/ice-servers.const'

export function useJoinHandler(roomId: string) {
  const logger = useLogger()

  const store = useWebRtcStore()
  const sendOffer = useSendOffer()

  async function createConnection(peerClientId: string) {
    const conn = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
      iceTransportPolicy: 'relay',
    })
    store.setConnection(peerClientId, conn)

    await sendOffer(conn, peerClientId)
  }

  onSocketAvailable((sock) => {
    sock.emit('join', {
      roomId,
    })
    logger.debug('Emitted join to room %s', roomId)

    sock.once('user_list_synced', (payload: { clientIds: string[] }) => {
      logger.debug(
        'Received initial user list. %s users',
        payload.clientIds.length,
      )

      payload.clientIds
        .filter((id) => id !== sock.id)
        .forEach((id) => createConnection(id))
    })
  })
}
