export interface RoomWsCommandPayloadMap {
  send_candidate: {
    toClientId: string
    candidate: RTCIceCandidate
  }

  send_description: {
    toClientId: string
    description: RTCSessionDescription
  }

  sync_user_list: {}
}

export interface RoomUser {
  id: string
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

  user_joined: RoomUser

  user_list_synced: {
    users: RoomUser[]
  }
}

export type RoomWsEventHandler<K extends keyof RoomWsEventPayloadMap> = (
  payload: RoomWsEventPayloadMap[K],
) => any
