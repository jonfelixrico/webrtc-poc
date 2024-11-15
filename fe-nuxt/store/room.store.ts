import { defineStore } from 'pinia'

export interface RoomState {
  users: Record<
    string,
    {
      id: string
    }
  >
}

export const useRoomStore = defineStore('room', {
  state: () =>
    ({
      users: {},
    }) as RoomState,
})
