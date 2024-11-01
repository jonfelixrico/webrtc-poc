import { defineStore } from 'pinia'
import { markRaw } from 'vue'

export type Connection = {
  connection: RTCPeerConnection
  polite: boolean
} & Partial<{
  isSettingRemoteAnswer: boolean
  isMakingOffer: boolean
  shouldIgnoreOffer: boolean
}>

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

  connectionsV2: Record<string, Connection>
}

export const useWebRtcStore = defineStore('webRtc', {
  state: () =>
    ({
      connections: {},
      streams: {},
      unpoliteMap: {},
      connectionsV2: {},
    }) as WebRtcStore,

  actions: {
    setConnection(
      clientId: string,
      connection: RTCPeerConnection,
      options?: { polite?: boolean },
    ) {
      this.connectionsV2[clientId] = {
        connection: markRaw(connection),
        polite: options?.polite ?? false,
      }
    },
  },
})
