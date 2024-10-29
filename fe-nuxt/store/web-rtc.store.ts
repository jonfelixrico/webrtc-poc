import { defineStore } from 'pinia'

export interface WebRtcStore {
  connections: Record<
    string,
    {
      isConnected: boolean
      connection: RTCPeerConnection
    }
  >
}

export const useWebRtcStore = defineStore('webRtc', {
  state: () =>
    ({
      connections: {},
    }) as WebRtcStore,
})
