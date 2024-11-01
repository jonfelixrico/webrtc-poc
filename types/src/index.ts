export interface RoomWsCommandMap {
  send_candidate: {
    toClient: string
    candidate: RTCIceCandidate
  }

  send_description: {
    toClient: string
    description: RTCSessionDescription
  }

  join: {
    roomId: string
  }
}

export type RoomCommandEmitFn<K extends keyof RoomWsCommandMap> = (
  event: K,
  payload: RoomWsCommandMap[K],
) => void

export interface RoomWsEventMap {
  candidate_sent: {
    fromClient: string
    candidate: RTCIceCandidate
  }

  description_sent: {
    fromClient: string
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

type RoomWsEventHandler<K extends keyof RoomWsEventMap> = (
  payload: RoomWsEventMap[K],
) => void

export type RoomWsEventListenFn<K extends keyof RoomWsEventMap> = (
  event: K,
  handler: RoomWsEventHandler<K>,
) => void
