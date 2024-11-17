import type { MaybeNullish } from '~/typings/util.types'

export interface RTCConnectionStates {
  connectionState: RTCPeerConnection['connectionState']
  signalingState: RTCPeerConnection['signalingState']
  iceGatheringState: RTCPeerConnection['iceGatheringState']
  iceConnectionState: RTCPeerConnection['iceConnectionState']
}

export interface AppPeerConnection {
  connection: RTCPeerConnection
  states: Partial<RTCConnectionStates>
  stream: MaybeNullish<MediaStream>
  clientId: string
}
