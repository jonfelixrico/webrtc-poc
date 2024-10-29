import { defineStore } from 'pinia'

export interface WebRtcStore {
  peerConnections: Record<string, RTCPeerConnection>
  connectionStatuses: Record<string, 'connected'>
}

export const useWebRtcStore = defineStore('webRtc', {
  state: () =>
    ({
      peerConnections: {},
      connectionStatuses: {},
    }) as WebRtcStore,
})
