import { defineStore } from 'pinia'

export interface WebRtcStore {
  connections: Record<
    string,
    {
      connectionState: RTCPeerConnection['connectionState']
      connection: RTCPeerConnection
      iceGatheringState: RTCPeerConnection['iceGatheringState']
      iceCandidates: RTCIceCandidate[]
    }
  >
}

export const useWebRtcStore = defineStore('webRtc', {
  state: () =>
    ({
      connections: {},
    }) as WebRtcStore,
})
