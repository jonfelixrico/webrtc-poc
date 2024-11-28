import type { RoomUser } from '@webrtcpoc/common'
import { defineStore } from 'pinia'

export interface RoomState {
  users: Record<string, RoomUser>

  preJoinDone: boolean
}

export const useRoomStore = defineStore('room', {
  state: () =>
    ({
      users: {},
      preJoinDone: false,
    }) as RoomState,
})
