import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import type { MaybeFalsy } from '~/typings/util.types'

interface ConnectionStates {
  connectionState: RTCPeerConnection['connectionState']
  signalingState: RTCPeerConnection['signalingState']
  iceGatheringState: RTCPeerConnection['iceGatheringState']
  iceConnectionState: RTCPeerConnection['iceConnectionState']
}

interface SignalingFlags {
  isSettingRemoteAnswer: boolean
  isMakingOffer: boolean
  shouldIgnoreOffer: boolean
}

export type Connection = {
  connection: RTCPeerConnection
  polite: boolean
  states: Partial<ConnectionStates>
  stream?: MaybeFalsy<MediaStream>
} & Partial<SignalingFlags>

export interface WebRtcStore {
  connections: Record<string, Connection>
}

export const useWebRtcStore = defineStore('webRtc', {
  state: () =>
    ({
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
        states: {},
      }
    },

    setStream(clientId: string, stream: MaybeFalsy<MediaStream>) {
      const conn = this.connections[clientId]
      if (!conn) {
        return
      }

      if (!stream) {
        conn.stream = null
      } else {
        conn.stream = markRaw(stream)
      }
    },

    setStateValue<K extends keyof ConnectionStates>(
      clientId: string,
      key: K,
      value: ConnectionStates[K],
    ) {
      const obj = this.connections[clientId]
      if (!obj) {
        return
      }

      obj.states[key] = value
    },

    setSignalingFlag<K extends keyof SignalingFlags>(
      clientId: string,
      key: K,
      value: SignalingFlags[K],
    ) {
      const obj = this.connections[clientId]
      if (!obj) {
        return
      }

      obj[key] = value
    },
  },
})
