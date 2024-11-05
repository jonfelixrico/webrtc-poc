export interface RoomWsCommandPayloadMap {
  send_candidate: {
    toClientId: string
    candidate: RTCIceCandidate
  }

  send_description: {
    toClientId: string
    description: RTCSessionDescription
  }

  join: {
    roomId: string
  }

  sync_user_list: {}
}

export interface RoomWsEventPayloadMap {
  candidate_sent: {
    fromClientId: string
    candidate: RTCIceCandidate
  }

  description_sent: {
    fromClientId: string
    description: RTCSessionDescription
  }

  user_list_synced: {
    clientIds: string[]
  }
}

export type RoomWsEventHandler<K extends keyof RoomWsEventPayloadMap> = (
  payload: RoomWsEventPayloadMap[K],
) => any
