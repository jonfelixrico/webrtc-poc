import { defineStore } from 'pinia'

export interface WebRtcStore {
  connections: Record<
    string,
    {
      connectionState: RTCPeerConnection['connectionState']
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
