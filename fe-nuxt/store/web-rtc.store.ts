import { defineStore } from 'pinia'

export interface WebRtcStore {
  peerConnections: Record<string, RTCPeerConnection>
}

export const useWebRtcStore = defineStore('webRtc', {
  state: () =>
    ({
      peerConnections: {},
    }) as WebRtcStore,
})
