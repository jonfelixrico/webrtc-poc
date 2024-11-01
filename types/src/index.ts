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
