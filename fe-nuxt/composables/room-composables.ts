import { onAppSocketEvent } from '~/composables/app-socket.composable'
import { useRoomStore } from '~/store/room.store'
import keyBy from 'lodash/keyBy'

export function useRoomMembersListener() {
  const store = useRoomStore()

  onAppSocketEvent('user_list_synced', ({ users }) => {
    store.users = keyBy(users, (u) => u.id)
  })
}
