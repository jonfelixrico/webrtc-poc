import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import type {
  AppPeerConnection,
  RTCConnectionStates,
} from '~/typings/rtc.types'
import type { MaybeFalsy } from '~/typings/util.types'

interface SignalingFlags {
  isSettingRemoteAnswer: boolean
  isMakingOffer: boolean
  shouldIgnoreOffer: boolean
}

export type Connection = AppPeerConnection & {
  polite: boolean
} & Partial<SignalingFlags>

export interface WebRtcStore {
  connections: Map<string, Connection>
}

export const useWebRtcStore = defineStore('webRtc', {
  state: () =>
    ({
      connections: new Map(),
    }) as WebRtcStore,

  actions: {
    setConnection(
      clientId: string,
      connection: RTCPeerConnection,
      options?: { polite?: boolean },
    ) {
      this.connections.set(clientId, {
        connection: markRaw(connection),
        polite: options?.polite ?? false,
        states: {},
        stream: null,
        clientId,
      })
    },

    setStream(clientId: string, stream: MaybeFalsy<MediaStream>) {
      const conn = this.connections.get(clientId)
      if (!conn) {
        return
      }

      if (!stream) {
        conn.stream = null
      } else {
        conn.stream = markRaw(stream)
      }
    },

    setStateValue<K extends keyof RTCConnectionStates>(
      clientId: string,
      key: K,
      value: RTCConnectionStates[K],
    ) {
      const obj = this.connections.get(clientId)
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
      const obj = this.connections.get(clientId)
      if (!obj) {
        return
      }

      obj[key] = value
    },
  },
})
