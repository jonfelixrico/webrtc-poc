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

  streams: Record<string, MediaStream>

  unpoliteMap: Record<string, boolean>
}

export const useWebRtcStore = defineStore('webRtc', {
  state: () =>
    ({
      connections: {},
      streams: {},
      unpoliteMap: {},
    }) as WebRtcStore,
})
