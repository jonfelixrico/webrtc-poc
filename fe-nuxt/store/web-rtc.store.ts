import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import type { MaybeFalsy } from '~/typings/util.types'

export type Connection = {
  connection: RTCPeerConnection
  polite: boolean
} & Partial<{
  isSettingRemoteAnswer: boolean
  isMakingOffer: boolean
  shouldIgnoreOffer: boolean
  stream: MaybeFalsy<MediaStream>
}>

export interface WebRtcStore {
  connections: Record<string, Connection>
}

export const useWebRtcStore = defineStore('webRtc', {
  state: () =>
    ({
      streams: {},
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
  },
})
