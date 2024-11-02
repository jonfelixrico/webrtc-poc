import type { MaybeFalsy } from '~/typings/util.types'

export interface RTCConnectionStates {
  connectionState: RTCPeerConnection['connectionState']
  signalingState: RTCPeerConnection['signalingState']
  iceGatheringState: RTCPeerConnection['iceGatheringState']
  iceConnectionState: RTCPeerConnection['iceConnectionState']
}

export interface ClientConnection {
  connection: RTCPeerConnection
  states: Partial<RTCConnectionStates>
  stream: MaybeFalsy<MediaStream>
}
