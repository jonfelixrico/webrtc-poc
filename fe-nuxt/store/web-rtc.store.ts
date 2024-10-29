import { defineStore } from 'pinia'

export interface WebRtcStore {
  peerConnections: Record<string, RTCPeerConnection>
  connectionStatuses: Record<string, 'connected'>
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
      peerConnections: {},
      connectionStatuses: {},
      connections: {},
    }) as WebRtcStore,
})
