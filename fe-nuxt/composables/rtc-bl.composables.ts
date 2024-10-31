import { useLogger, type MaybeRef } from '#imports'
import { useCreateConnection } from '~/composables/rtc-signaling-v2.composable'
import { onSocketAvailable } from '~/composables/socket-v2.composable'

export function useJoinHandler(roomId: MaybeRef<string>) {
  const logger = useLogger()

  const createConnection = useCreateConnection()

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
