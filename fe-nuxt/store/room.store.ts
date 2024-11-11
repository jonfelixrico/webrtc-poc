import { defineStore } from 'pinia'

export interface RoomState {
  user: Record<
    string,
    {
      id: string
    }
  >
}

export const useRoomStore = defineStore('room', {
  state: () =>
    ({
      user: {},
    }) as RoomState,
})
