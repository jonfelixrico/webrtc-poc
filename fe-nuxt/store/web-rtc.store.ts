import { defineStore } from 'pinia'
import { markRaw } from 'vue'

export type Connection = {
  connection: RTCPeerConnection
  polite: boolean
} & Partial<{
  isSettingRemoteAnswer: boolean
  isMakingOffer: boolean
  shouldIgnoreOffer: boolean
  stream: MediaStream
}>

export interface WebRtcStore {
  connections: Record<string, Connection>
}

export const useWebRtcStore = defineStore('webRtc', {
  state: () =>
    ({
      streams: {},
      connections: {},
    }) as WebRtcStore,

  actions: {
    setConnection(
      clientId: string,
      connection: RTCPeerConnection,
      options?: { polite?: boolean },
    ) {
      this.connections[clientId] = {
        connection: markRaw(connection),
        polite: options?.polite ?? false,
      }
    },
  },
})
