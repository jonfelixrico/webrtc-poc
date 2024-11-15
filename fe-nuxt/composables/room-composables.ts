import { onAppSocketEvent } from '~/composables/app-socket.composable'
import { useRoomStore } from '~/store/room.store'
import keyBy from 'lodash/keyBy'
import { useLogger } from '~/composables/logger.composable'

export function useRoomMembersListener() {
  const store = useRoomStore()
  const logger = useLogger()

  onAppSocketEvent('user_list_synced', (msg) => {
    const updatedUserMap = keyBy(msg.users, (u) => u.id)

    const currentIds = new Set(Object.keys(store.users))
    const updatedIds = new Set(Object.keys(updatedUserMap))

    const addedIds = updatedIds.difference(currentIds)
    const removedIds = currentIds.difference(updatedIds)

    logger.info(
      'User list updated; %s users; joined %o; left %o',
      updatedIds.size,
      Array.from(addedIds),
      Array.from(removedIds),
    )

    store.users = updatedUserMap
  })
}
