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
}

export type RoomCommandEmitFn<K extends keyof RoomWsCommandPayloadMap> = (
  event: K,
  payload: RoomWsCommandPayloadMap[K],
) => void

export interface RoomWsEventPayloadMap {
  candidate_sent: {
    fromClientId: string
    candidate: RTCIceCandidate
  }

  description_sent: {
    fromClientId: string
    description: RTCIceCandidate
  }

  user_list_synced: {
    clientIds: string[]
    roomId: string
  }

  user_joined: {
    clientId: string
    roomId: string
  }
}

type RoomWsEventHandler<K extends keyof RoomWsEventPayloadMap> = (
  payload: RoomWsEventPayloadMap[K],
) => void

export type RoomWsEventListenFn<K extends keyof RoomWsEventPayloadMap> = (
  event: K,
  handler: RoomWsEventHandler<K>,
) => void
