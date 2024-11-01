export interface RoomWsCommandMap {
  send_candidate: {
    toClient: string
    candidate: RTCIceCandidate
  }
}
