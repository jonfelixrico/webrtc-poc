import { defineStore } from 'pinia'
import type { Socket } from 'socket.io-client'

export interface WebsocketStoreState {
  socket: Socket | null
}

export const useSocketStore = defineStore('socket', {
  state: () =>
    ({
      socket: null,
    }) as WebsocketStoreState,
})
