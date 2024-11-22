import { defineStore } from 'pinia'

export interface RoomState {
  users: Record<
    string,
    {
      id: string
    }
  >

  preJoinDone: boolean
}

export const useRoomStore = defineStore('room', {
  state: () =>
    ({
      users: {},
      preJoinDone: false,
    }) as RoomState,
})
